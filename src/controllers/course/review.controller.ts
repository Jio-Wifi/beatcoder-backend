import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import ReviewService from '../../service/course/review.service';

export const createReview = catchAsync(async (req: Request, res: Response) => {
  const review = await ReviewService.createReview(req.body);
  res.status(201).json({ message: 'Review created successfully', review });
});

export const getAllReviews = catchAsync(async (_req: Request, res: Response) => {
  const reviews = await ReviewService.getAllReviews();
  res.status(200).json({ reviews });
});

export const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const review = await ReviewService.getReviewById(req.params.id);
  res.status(200).json({ review });
});

export const deleteReview = catchAsync(async (req: Request, res: Response) => {
  await ReviewService.deleteReview(req.params.id);
  res.status(200).json({ message: 'Review deleted successfully' });
});
