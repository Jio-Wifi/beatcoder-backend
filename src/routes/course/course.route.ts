import express from 'express';

import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from '../../controllers/course/course.controller';
import { createCourseValidation } from '../../validations/course/course/create.course.validation';
import { updateCourseValidation } from '../../validations/course/course/update.course.validation';
import { deleteCourseValidation } from '../../validations/course/course/delete.course.validation';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { authorizeRoles } from '../../middleware/authorize.role';
import { validateRequest } from '../../middleware/validation.middleware';
import upload from '../../middleware/multer.middleware';
import { checkSubscription } from '../../middleware/check.subscription';

const courseRoutes = express.Router();

export const courseUpload = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'image', maxCount: 1 }, // image = thumbnail
]);

// 🔐 Admin routes
courseRoutes.post(
  '/',
  isAuthenticate,
  authorizeRoles('admin'),
  courseUpload,
  createCourseValidation,
  validateRequest,
  createCourse
);

courseRoutes.put(
  '/:id',
  isAuthenticate,
  authorizeRoles('admin'),
  courseUpload,
  updateCourseValidation,
  validateRequest,
  updateCourse
);

courseRoutes.delete(
  '/:id',
  isAuthenticate,
  authorizeRoles('admin'),
  deleteCourseValidation,
  validateRequest,
  deleteCourse
);

// 🌐 Public routes
courseRoutes.get('/', getAllCourses);
// 🔐 Premimum routes
courseRoutes.get('/:id',isAuthenticate,checkSubscription, getCourseById);

export default courseRoutes;
