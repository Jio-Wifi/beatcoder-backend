import mongoose from 'mongoose';
import Problem from '../../models/code/problem.schema';
import TestCase, { ITestCase } from '../../models/code/testcase.schema';
import CustomError from '../../utils/custom.error';

export interface CreateTestCaseInput {
  input: string;
  expectedOutput: string;
  isPublic?: boolean;
  problem: mongoose.Types.ObjectId | string;
  createdBy: mongoose.Types.ObjectId | string;
}

class TestCaseService {
  async createTestCase(data: CreateTestCaseInput): Promise<ITestCase> {
    if (!mongoose.Types.ObjectId.isValid(data.problem)) {
      throw new CustomError('Invalid problem ID format', 400);
    }

    const problem = await Problem.findById(data.problem);
    if (!problem) {
      throw new CustomError('Problem not found. Cannot create test case.', 404);
    }

    const testCase = await TestCase.create({
      input: data.input,
      expectedOutput: data.expectedOutput,
      isPublic: data.isPublic ?? false,
      problem: problem._id,
      createdBy: data.createdBy,
    });

    problem.testCases.push(testCase._id as mongoose.Types.ObjectId);
    await problem.save();

    return testCase;
  }

  async getTestCasesByProblem(problemId: string, userId?: string): Promise<ITestCase[]> {
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      throw new CustomError('Invalid problem ID', 400);
    }

    return await TestCase.find({
      problem: problemId,
      $or: [
        { isPublic: true },
        { createdBy: userId },
      ],
    });
  }

    async getTestCaseById(id: string): Promise<ITestCase> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid test case ID', 400);
    }

    const testCase = await TestCase.findById(id);
    if (!testCase) {
      throw new CustomError('Test case not found', 404);
    }

    return testCase;
  }


  async updateTestCase(id: string, updates: Partial<ITestCase>, userId: string): Promise<ITestCase> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid test case ID', 400);
    }

    const testCase = await TestCase.findById(id);
    if (!testCase) {
      throw new CustomError('Test case not found', 404);
    }

    if (testCase.createdBy.toString() !== userId.toString()) {
      throw new CustomError('Unauthorized: You can only update your own test cases', 403);
    }

    Object.assign(testCase, updates);
    await testCase.save();
    return testCase;
  }

  async deleteTestCase(id: string, userId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid test case ID', 400);
    }

    const testCase = await TestCase.findById(id);
    if (!testCase) {
      throw new CustomError('Test case not found', 404);
    }

    if (testCase.createdBy.toString() !== userId.toString()) {
      throw new CustomError('Unauthorized: You can only delete your own test cases', 403);
    }

    await TestCase.findByIdAndDelete(id);

    await Problem.updateOne(
      { testCases: id },
      { $pull: { testCases: id } }
    );
  }
}

export default new TestCaseService();
