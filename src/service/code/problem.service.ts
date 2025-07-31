import slugify from 'slugify';
import fs from 'fs/promises';
import Problem, { IProblem } from '../../models/code/problem.schema';
import CustomError from '../../utils/custom.error';
import { uploadToCloudinary } from '../../utils/cloudinary';

interface CreateProblemInput {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  constraints?: string;
  subject: string;
  starterCode?: {
    [language: string]: string;
  };
  videoSolutions?: {
    title: string;
    url?: string;            // Will be replaced with uploaded Cloudinary URL
    videoPath?: string;      // Local temp path for video (from multer)
    thumbnailPath?: string;  // Local temp path for thumbnail (from multer)
    duration?: string;
    language?: string;
    codeLanguage?: string;   // Java, Python, etc.
    isPremium?: boolean;
    thumbnail?: string;      // Final Cloudinary thumbnail URL
    description?: string;
    uploadedBy?: string;
    createdAt?: Date;
  }[];
}

class ProblemService {
  async createProblem(data: CreateProblemInput): Promise<IProblem> {
    const slug = slugify(data.title, { lower: true });

    const existing = await Problem.findOne({ slug });
    if (existing) {
      throw new CustomError('Problem with this title already exists', 400);
    }

    if (!data.subject) {
      throw new CustomError('Subject is required for the problem', 400);
    }

    const processedVideoSolutions = [];
    if (data.videoSolutions && data.videoSolutions.length > 0) {
      for (const video of data.videoSolutions) {
        let videoUrl = video.url;
        let thumbnailUrl = video.thumbnail;

        if (video.videoPath) {
          const uploadedVideo = await uploadToCloudinary(video.videoPath, {
            resourceType: 'video',
            folder: 'problem-video-solutions',
          });
          videoUrl = uploadedVideo.secure_url;
          await fs.unlink(video.videoPath);
        }

        if (video.thumbnailPath) {
          const uploadedThumb = await uploadToCloudinary(video.thumbnailPath, {
            resourceType: 'image',
            folder: 'problem-thumbnails',
          });
          thumbnailUrl = uploadedThumb.secure_url;
          await fs.unlink(video.thumbnailPath);
        }

        processedVideoSolutions.push({
          ...video,
          url: videoUrl,
          thumbnail: thumbnailUrl,
          createdAt: new Date(),
        });
      }
    }

    const problem = await Problem.create({
      ...data,
      slug,
      videoSolutions: processedVideoSolutions,
    });

    return problem;
  }

async getAllProblems(subject?: string, difficulty?: 'easy' | 'medium' | 'hard'): Promise<IProblem[]> {
  const filter: Record<string, unknown> = {};

  if (subject) filter.subject = subject;
  if (difficulty) filter.difficulty = difficulty;

  return await Problem.find(filter).sort({ createdAt: -1 });
}


  async getProblemBySlug(slug: string): Promise<IProblem> {
    const problem = await Problem.findOne({ slug });
    if (!problem) {
      throw new CustomError('Problem not found', 404);
    }
    return problem;
  }

  async updateProblem(slug: string, updates: Partial<CreateProblemInput>): Promise<IProblem> {
    const processedVideoSolutions = [];
    if (updates.videoSolutions && updates.videoSolutions.length > 0) {
      for (const video of updates.videoSolutions) {
        let videoUrl = video.url;
        let thumbnailUrl = video.thumbnail;

        if (video.videoPath) {
          const uploadedVideo = await uploadToCloudinary(video.videoPath, {
            resourceType: 'video',
            folder: 'problem-video-solutions',
          });
          videoUrl = uploadedVideo.secure_url;
          await fs.unlink(video.videoPath);
        }

        if (video.thumbnailPath) {
          const uploadedThumb = await uploadToCloudinary(video.thumbnailPath, {
            resourceType: 'image',
            folder: 'problem-thumbnails',
          });
          thumbnailUrl = uploadedThumb.secure_url;
          await fs.unlink(video.thumbnailPath);
        }

        processedVideoSolutions.push({
          ...video,
          url: videoUrl,
          thumbnail: thumbnailUrl,
          createdAt: video.createdAt ?? new Date(),
        });
      }
    }

    const updatedProblem = await Problem.findOneAndUpdate(
      { slug },
      { ...updates, videoSolutions: processedVideoSolutions },
      { new: true, runValidators: true }
    );

    if (!updatedProblem) {
      throw new CustomError('Problem not found', 404);
    }

    return updatedProblem;
  }

  async deleteProblem(slug: string): Promise<void> {
    const result = await Problem.findOneAndDelete({ slug });
    if (!result) {
      throw new CustomError('Problem not found', 404);
    }
  }
}

export default new ProblemService();
