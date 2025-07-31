import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import InstructorService from '../../service/course/instructor.service';

export const createInstructor = catchAsync(async (req: Request, res: Response) => {
  const instructor = await InstructorService.createInstructor(req.body);
  res.status(201).json({ message: 'Instructor created', instructor });
});

export const getAllInstructors = catchAsync(async (_req: Request, res: Response) => {
  const instructors = await InstructorService.getAllInstructors();
  res.status(200).json({ instructors });
});

export const getInstructorById = catchAsync(async (req: Request, res: Response) => {
  const instructor = await InstructorService.getInstructorById(req.params.id);
  res.status(200).json({ instructor });
});

export const updateInstructor = catchAsync(async (req: Request, res: Response) => {
  const updated = await InstructorService.updateInstructor(req.params.id, req.body);
  res.status(200).json({ message: 'Instructor updated', updated });
});

export const deleteInstructor = catchAsync(async (req: Request, res: Response) => {
  await InstructorService.deleteInstructor(req.params.id);
  res.status(200).json({ message: 'Instructor deleted' });
});
