import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import LessonService from '../../service/course/lesson.service';

export const createLesson = catchAsync(async (req: Request, res: Response) => {
  const lessonData = {
  ...req.body,
    videoPath: req.file?.path, // ✅ Pass the uploaded file's path
  };

  const lesson = await LessonService.createLesson(lessonData);
  res.status(201).json({ message: 'Lesson created successfully', lesson });
});

export const getAllLessons = catchAsync(async (_req: Request, res: Response) => {
  const lessons = await LessonService.getAllLessons();
  res.status(200).json({ lessons });
});

export const getLessonsByCourseId = catchAsync(async (req: Request, res: Response) => {
  const lessons = await LessonService.getLessonsByCourseId(req.params.courseId);
  res.status(200).json({ lessons });
});

export const getLessonById = catchAsync(async (req: Request, res: Response) => {
  const lesson = await LessonService.getLessonById(req.params.id);
  res.status(200).json({ lesson });
});

export const updateLesson = catchAsync(async (req: Request, res: Response) => {
  const videoPath = req.file?.path; // ✅ capture uploaded file path

  const updated = await LessonService.updateLesson(req.params.id, {
    ...req.body,
    videoPath, // ✅ include it in the payload
  });

  res.status(200).json({ message: 'Lesson updated successfully', updated });
});
export const deleteLesson = catchAsync(async (req: Request, res: Response) => {
  await LessonService.deleteLesson(req.params.id);
  res.status(200).json({ message: 'Lesson deleted successfully' });
});


