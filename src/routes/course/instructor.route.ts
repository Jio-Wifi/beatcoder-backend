import express from 'express';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { authorizeRoles } from '../../middleware/authorize.role';
import { createInstructorValidation } from '../../validations/course/instructor/create.instructor.validation';
import { validateRequest } from '../../middleware/validation.middleware';
import { createInstructor, deleteInstructor, getAllInstructors, getInstructorById, updateInstructor } from '../../controllers/course/instructor.controller';

const instructorRoutes = express.Router();

instructorRoutes.post(
  '/',
  isAuthenticate,
  authorizeRoles('admin'),
  createInstructorValidation,
  validateRequest,
  createInstructor
);

instructorRoutes.put('/:id', isAuthenticate, authorizeRoles('admin'), updateInstructor);
instructorRoutes.delete('/:id', isAuthenticate, authorizeRoles('admin'), deleteInstructor);
instructorRoutes.get('/', getAllInstructors);
instructorRoutes.get('/:id', getInstructorById);

export default instructorRoutes;
