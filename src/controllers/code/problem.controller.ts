import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import ProblemService from '../../service/code/problem.service';

// POST /api/problems
export const createProblem = catchAsync(async (req: Request, res: Response) => {
  const { title, description, difficulty, constraints, subject } = req.body;

  if (!subject) {
    return res.status(400).json({ message: 'Subject is required' });
  }

  const data = { title, description, difficulty, constraints, subject };
  const problem = await ProblemService.createProblem(data);

  return res.status(201).json({
    message: 'Problem created',
    problem,
  });
});

// GET /api/problems
export const getAllProblems = catchAsync(async (req: Request, res: Response) => {
  const { subject, difficulty } = req.query;

  // Validate difficulty (must match enum)
  const validDifficulties = ["easy", "medium", "hard"];
  const diff = difficulty && validDifficulties.includes(String(difficulty).toLowerCase())
    ? (String(difficulty).toLowerCase() as "easy" | "medium" | "hard")
    : undefined;

  const problems = await ProblemService.getAllProblems(
    subject ? String(subject) : undefined,
    diff
  );

  return res.status(200).json({
    count: problems.length,
    problems,
  });
});




// GET /api/problems/:slug
export const getProblemBySlug = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const problem = await ProblemService.getProblemBySlug(slug);
  return res.status(200).json({ problem });
});

// PUT /api/problems/:slug
export const updateProblem = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const updates = req.body;

  const updated = await ProblemService.updateProblem(slug, updates);
  return res.status(200).json({
    message: 'Problem updated successfully',
    updated,
  });
});

// DELETE /api/problems/:slug
export const deleteProblem = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  await ProblemService.deleteProblem(slug);
  return res.status(200).json({ message: 'Problem deleted successfully' });
});
