import express from 'express';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { validateRequest } from '../../middleware/validation.middleware';
import { createSubmissionValidation } from '../../validations/code/submission/create.submission.validation';
import {
  createSubmission,
  getMyLanguagesStats,
  getMyRecentAccepted,
  getMySubmissionActivity,
  getMySubmissions,
  getMySubmissionsBySlug,
  getProblemSubmissionsRaw,
  getSubmissionById,
  runCode,
} from '../../controllers/code/submission.controller';

const submissionRoutes = express.Router();

submissionRoutes.post(
  '/submit',
  isAuthenticate,
  createSubmissionValidation,
  validateRequest,
  createSubmission
);

submissionRoutes.post(
  "/run",
  isAuthenticate,
  createSubmissionValidation, 
  validateRequest,
  runCode
);

submissionRoutes.get('/me', isAuthenticate, getMySubmissions);
submissionRoutes.get('/:id', isAuthenticate, getSubmissionById);
submissionRoutes.get('/my/problem/:slug', isAuthenticate, getMySubmissionsBySlug);

submissionRoutes.get('/problem/:slug',getProblemSubmissionsRaw);


//  Get problems solved grouped by language for user dashboard
submissionRoutes.get('/me/languages', isAuthenticate, getMyLanguagesStats);

submissionRoutes.get('/accept/me', isAuthenticate, getMyRecentAccepted);

submissionRoutes.get('/me/activity', isAuthenticate, getMySubmissionActivity);

export default submissionRoutes;
