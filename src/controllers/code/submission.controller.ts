import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import SubmissionService from '../../service/code/submission.service';
import TestCase from '../../models/code/testcase.schema';
import { runJudge0 } from '../../utils/judge.zero';

const languageIdMap: Record<string, number> = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
};

// Convert KB to MB (LeetCode-style)
const formatMemory = (kb?: number) => {
  if (!kb || kb <= 0) return 0;
  return parseFloat((kb / 1024).toFixed(2)); // MB with 2 decimals
};

export const runCode = catchAsync(async (req: Request, res: Response) => {
  const { code, language, problem } = req.body;

  const language_id = languageIdMap[language.toLowerCase()];
  if (!language_id) {
    return res.status(400).json({ message: 'Unsupported language' });
  }

  const testCases = await TestCase.find({ problem });
  if (testCases.length === 0) {
    return res.status(400).json({ message: 'No test cases found for this problem.' });
  }

  let passed = 0;
  let failed = 0;
  let finalStatus: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compilation Error' = 'Accepted';
  let finalOutput = '';
  let finalError = '';
  let totalTime = 0;
  let maxMemory = 0;

  for (const test of testCases) {
    const result = await runJudge0({
      source_code: code,
      language_id,
      stdin: test.input,
    });

    totalTime += result.time ? parseFloat(result.time) * 1000 : 0;
    maxMemory = Math.max(maxMemory, result.memory || 0);

    const stdout = result.stdout?.trim() || '';
    const expected = test.expectedOutput.trim();

    if (result.status?.description === 'Compilation Error') {
      finalStatus = 'Compilation Error';
      finalError = result.compile_output || 'Compilation failed';
      break;
    }

    if (result.stderr) {
      finalStatus = 'Runtime Error';
      finalError = result.stderr;
      break;
    }

    if (stdout !== expected) {
      finalStatus = 'Wrong Answer';
      finalOutput = stdout;
      failed++;
      break;
    }

    passed++;
    finalOutput = stdout;
  }

  return res.status(200).json({
    message: 'Run completed',
    status: finalStatus,
    passed,
    failed,
    output: finalOutput,
    error: finalError,
    executionTime: totalTime,
    memory: formatMemory(maxMemory), // return in MB
  });
});

export const createSubmission = catchAsync(async (req: Request, res: Response) => {
  const { code, language, problem, isRunOnly = false } = req.body;
  const user = (req as any).user;
  const userId = user._id;

  const language_id = languageIdMap[language.toLowerCase()];
  if (!language_id) {
    return res.status(400).json({ message: 'Unsupported language' });
  }

  const testCases = await TestCase.find({ problem });
  if (testCases.length === 0) {
    return res.status(400).json({ message: 'No test cases found for this problem' });
  }

  let passed = 0;
  let failed = 0;
  let finalStatus: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compilation Error' = 'Accepted';
  let finalOutput = '';
  let finalError = '';
  let totalTime = 0;
  let maxMemory = 0;

  for (const test of testCases) {
    const result = await runJudge0({
      source_code: code,
      language_id,
      stdin: test.input,
    });

    totalTime += result.time ? parseFloat(result.time) * 1000 : 0;
    maxMemory = Math.max(maxMemory, result.memory || 0);

    const stdout = result.stdout?.trim() || '';
    const expected = test.expectedOutput.trim();

    if (result.status?.description === 'Compilation Error') {
      finalStatus = 'Compilation Error';
      finalError = result.compile_output || 'Compilation failed';
      break;
    }

    if (result.stderr) {
      finalStatus = 'Runtime Error';
      finalError = result.stderr;
      break;
    }

    if (stdout !== expected) {
      finalStatus = 'Wrong Answer';
      finalOutput = stdout;
      failed++;
      break;
    }

    passed++;
    finalOutput = stdout;
  }

  // If only running (not saving submission)
  if (isRunOnly) {
    return res.status(200).json({
      message: 'Run completed',
      status: finalStatus,
      passed,
      failed,
      output: finalOutput,
      error: finalError,
      executionTime: totalTime,
      memory: formatMemory(maxMemory),
    });
  }

  // Save to DB
  const submission = await SubmissionService.createSubmission({
    user: userId,
    problem,
    code,
    language,
  });

  await SubmissionService.updateSubmissionResult(submission._id as string, {
    status: finalStatus,
    output: finalOutput,
    error: finalError,
    executionTime: totalTime,
    memory: formatMemory(maxMemory),
  });

  return res.status(201).json({
    message: 'Submission completed',
    status: finalStatus,
    passed,
    failed,
    output: finalOutput,
    error: finalError,
    executionTime: totalTime,
    memory: formatMemory(maxMemory),
    submissionId: submission._id,
  });
});

export const getMySubmissions = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const submissions = await SubmissionService.getUserSubmissions(user._id);
  return res.status(200).json( submissions );
});

export const getProblemSubmissionsRaw = catchAsync(async (req:Request,res:Response) =>{
    const { slug } = req.params;
    const submissions = await SubmissionService.getProblemSubmissionsRawFields(slug);
   return res.status(200).json({submissions});
})

export const getMySubmissionsBySlug = catchAsync(async (req:Request,res:Response) => {
     const user = (req as any).user;
    const { slug } = req.params;

     const submissions = await SubmissionService.getMySubmissionsBySlugField(slug,user._id);
   return res.status(200).json({submissions});
})

export const getSubmissionById = catchAsync(async (req: Request, res: Response) => {
  const submission = await SubmissionService.getSubmissionById(req.params.id);
  res.status(200).json({ submission });
});

export const getMyLanguagesStats = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const languagesStats = await SubmissionService.getSolvedProblemsByLanguage(user._id);
  res.status(200).json({ languages: languagesStats });
});

export const getMyRecentAccepted = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const recents = await SubmissionService.getRecentAccepted(user._id, 10);
  res.status(200).json({ recents });
});

export const getMySubmissionActivity = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const days = parseInt(req.query.days as string) || 90;

  const activity = await SubmissionService.getUserSubmissionActivity(user._id, days);

  // Fill in missing days
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - days);

  const dateMap: Record<string, number> = {};
  activity.forEach((item: { date: Date; count: number }) => {
    dateMap[item.date.toISOString().split('T')[0]] = item.count;
  });

  const filled = [];
  for (let i = 0; i <= days; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    filled.push({ date: dateStr, count: dateMap[dateStr] || 0 });
  }

  res.status(200).json({ activity: filled });
});
