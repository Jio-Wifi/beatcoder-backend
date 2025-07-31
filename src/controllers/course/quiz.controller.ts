import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import QuizService from '../../service/course/quiz.service';

export const createQuiz = catchAsync(async (req: Request, res: Response) => {
  const quiz = await QuizService.createQuiz(req.body);
  res.status(201).json({ message: 'Quiz created successfully', quiz });
});

export const getAllQuizzes = catchAsync(async (_req: Request, res: Response) => {
  const quizzes = await QuizService.getAllQuizzes();
  res.status(200).json({ quizzes });
});

export const getQuizById = catchAsync(async (req: Request, res: Response) => {
  const quiz = await QuizService.getQuizById(req.params.id);
  res.status(200).json({ quiz });
});

export const updateQuiz = catchAsync(async (req: Request, res: Response) => {
  const updated = await QuizService.updateQuiz(req.params.id, req.body);
  res.status(200).json({ message: 'Quiz updated successfully', updated });
});

export const deleteQuiz = catchAsync(async (req: Request, res: Response) => {
  await QuizService.deleteQuiz(req.params.id);
  res.status(200).json({ message: 'Quiz deleted successfully' });
});
