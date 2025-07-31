import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import ProgressService from '../../service/course/progress.service';

export const createProgress = catchAsync(async (req: Request, res: Response) => {
  const progress = await ProgressService.createProgress(req.body);
  res.status(201).json({ message: 'Progress created successfully', progress });
});

export const getAllProgress = catchAsync(async (_req: Request, res: Response) => {
  const progressList = await ProgressService.getAllProgress();
  res.status(200).json({ progressList });
});

export const getProgressById = catchAsync(async (req: Request, res: Response) => {
  const progress = await ProgressService.getProgressById(req.params.id);
  res.status(200).json({ progress });
});

export const updateProgress = catchAsync(async (req: Request, res: Response) => {
  const updated = await ProgressService.updateProgress(req.params.id, req.body);
  res.status(200).json({ message: 'Progress updated successfully', updated });
});

export const deleteProgress = catchAsync(async (req: Request, res: Response) => {
  await ProgressService.deleteProgress(req.params.id);
  res.status(200).json({ message: 'Progress deleted successfully' });
});
