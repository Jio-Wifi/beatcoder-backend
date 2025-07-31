import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import CourseService from '../../service/course/course.service';

// POST /api/courses
export const createCourse = catchAsync(async (req: Request, res: Response) => {
  const {
    title,
    description,
    rating,
    // price,
    isPublished,
  } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const videoPath = files?.video?.[0]?.path;
  const thumbnailPath = files?.image?.[0]?.path;

  const course = await CourseService.createCourse({
    title,
    description,
    rating,
    isPublished,
    videoPath,
    thumbnailPath,
  });

  res.status(201).json({
    message: 'Course created successfully',
    course,
  });
});

// GET /api/courses
export const getAllCourses = catchAsync(async (_req: Request, res: Response) => {
  const courses = await CourseService.getAllCourses();
  res.status(200).json({ courses });
});

// GET /api/courses/:id
export const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const course = await CourseService.getCourseById(req.params.id);
  res.status(200).json(course);
});

// PUT /api/courses/:id
export const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const updates = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const videoPath = files?.video?.[0]?.path;
  const thumbnailPath = files?.image?.[0]?.path;

  if (videoPath) updates.videoPath = videoPath;
  if (thumbnailPath) updates.thumbnailPath = thumbnailPath;

  const updated = await CourseService.updateCourse(req.params.id, updates);

  res.status(200).json({
    message: 'Course updated successfully',
    updated,
  });
});

// DELETE /api/courses/:id
export const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  await CourseService.deleteCourse(req.params.id);
  res.status(200).json({ message: 'Course deleted successfully' });
});
