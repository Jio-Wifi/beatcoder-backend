import express from 'express';
import { createProgress, deleteProgress, getAllProgress, getProgressById, updateProgress } from '../../controllers/course/progress.controller';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { authorizeRoles } from '../../middleware/authorize.role';
import { createProgressValidation } from '../../validations/course/progress/create.progress.validation';
import { validateRequest } from '../../middleware/validation.middleware';
import { updateProgressValidation } from '../../validations/course/progress/update.progress.validation';
import { deleteProgressValidation } from '../../validations/course/progress/delete.progress.validation';
import { checkSubscription } from '../../middleware/check.subscription';


const progressRoutes = express.Router();

// Public Routes
progressRoutes.get('/', getAllProgress);

// Premimum Access
progressRoutes.get('/:id',isAuthenticate,checkSubscription, getProgressById);

// Protected Routes
progressRoutes.post(
  '/',
  isAuthenticate,
  authorizeRoles('user', 'admin'),
  createProgressValidation,
  validateRequest,
  createProgress
);

progressRoutes.put(
  '/:id',
  isAuthenticate,
  authorizeRoles('user', 'admin'),
  updateProgressValidation,
  validateRequest,
  updateProgress
);

progressRoutes.delete(
  '/:id',
  isAuthenticate,
  authorizeRoles('admin'),
  deleteProgressValidation,
  validateRequest,
  deleteProgress
);

export default progressRoutes;
