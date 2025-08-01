import mongoose from "mongoose";
import fs from "fs/promises";
import Lesson, { ILesson } from "../../models/course/lesson.schema";
import CustomError from "../../utils/custom.error";
import { uploadToCloudinary } from "../../utils/cloudinary";
import Course from "../../models/course/course.schema";

interface LessonData {
  title?: string;
  content?: string;
  videoPath?: string;
  videoUrl?: string;
  videoDescription?: string;
  videoDuration?: number;
  videoType?: "mp4" | "youtube" | "vimeo";
  transcript?: string;
  resources?: string[];
  isFreePreview?: boolean;
  course?: mongoose.Types.ObjectId;
  order?: number;
}

class LessonService {
  async createLesson(data: LessonData): Promise<ILesson> {
    let videoUrl: string | undefined;

    // Upload video if present
    if (data.videoPath) {
      try {
        const uploadResult = await uploadToCloudinary(data.videoPath, {
          folder: "lesson-videos",
          resourceType: "video",
        });
        videoUrl = uploadResult.secure_url;
        await fs.unlink(data.videoPath); // remove local file
      } catch (error) {
        throw new CustomError(
          "Failed to upload lesson video or delete file",
          500
        );
      }
    }

    // Ensure course exists before creating lesson
    const course = await Course.findById(data.course);
    if (!course) {
      throw new CustomError("Course not found", 404);
    }

    // Create lesson
    const newLesson = await Lesson.create({
      ...data,
      videoUrl,
    });

    // Push lesson ID to course.lessons[]
    if (!course.lessons) {
      course.lessons = [];
    }
    course.lessons.push(newLesson._id as mongoose.Types.ObjectId);

    await course.save();

    return newLesson;
  }

  async getAllLessons(): Promise<ILesson[]> {
    return await Lesson.find().populate("course");
  }

  async getLessonsByCourseId(courseId: string): Promise<ILesson[]> {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new CustomError("Invalid course ID", 400);
    }
    return await Lesson.find({ course: courseId }).sort({ order: 1 });
  }

  async getLessonById(id: string): Promise<ILesson> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid lesson ID", 400);
    }

    const lesson = await Lesson.findById(id).populate("course");
    if (!lesson) {
      throw new CustomError("Lesson not found", 404);
    }

    return lesson;
  }

  async updateLesson(
    id: string,
    updates: Partial<LessonData>
  ): Promise<ILesson> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid lesson ID", 400);
    }

    const updateData: Partial<LessonData> = { ...updates };

    // Upload new video if provided
    if (updates.videoPath) {
      try {
        const uploadResult = await uploadToCloudinary(updates.videoPath, {
          folder: "lesson-videos",
          resourceType: "video",
        });

        updateData.videoUrl = uploadResult.secure_url;

        // Safely remove temp video file
        await fs.unlink(updates.videoPath);
      } catch (err) {
        console.error("Video upload failed:", err);
        throw new CustomError("Failed to upload lesson video", 500);
      }
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("course");

    if (!updatedLesson) {
      throw new CustomError("Lesson not found", 404);
    }

    return updatedLesson;
  }

  async deleteLesson(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid lesson ID", 400);
    }

    const deleted = await Lesson.findByIdAndDelete(id);
    if (!deleted) {
      throw new CustomError("Lesson not found", 404);
    }
  }
}

export default new LessonService();
