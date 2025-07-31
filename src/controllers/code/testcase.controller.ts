import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import TestCaseService from '../../service/code/testcase.service'

export const createTestCase = catchAsync(async (req: Request, res: Response) => {
  const { input, expectedOutput, isPublic, problem } = req.body;
  const user = (req as any).user;

  const testCase = await TestCaseService.createTestCase({
    input,
    expectedOutput,
    isPublic,
    problem,
    createdBy: user._id,
  });

  return res.status(201).json({
    message: 'Test case created',
    testCase,
  });
});

export const getTestCasesByProblem = catchAsync(async (req: Request, res: Response) => {
  const { problemId } = req.params;
  const user = (req as any).user;

  const testCases = await TestCaseService.getTestCasesByProblem(problemId, user?._id);

  return res.status(200).json({
    message: 'Test cases fetched',
    testCases,
  });
});

export const getTestCaseById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const testCase = await TestCaseService.getTestCaseById(id);

  return res.status(200).json({
    message: 'Test case fetched',
    testCase,
  });
});

export const updateTestCase = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  const updated = await TestCaseService.updateTestCase(id, req.body, user._id);

  return res.status(200).json({
    message: 'Test case updated',
    testCase: updated,
  });
});

export const deleteTestCase = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  await TestCaseService.deleteTestCase(id, user._id);

  return res.status(202).json({
    message: 'Deleted test case successfully.',
  });
});
