// import express from 'express';
// import { enroll, getAllEnrollments, getEnrollmentById, deleteEnrollment } from '../../controllers/course/enrollement.controller';
// import { isAuthenticate } from '../../middleware/is.authenticate';
// import { authorizeRoles } from '../../middleware/authorize.role';
// import { createEnrollmentValidation } from '../../validations/course/enrollement/create.enrollement.validation';
// import { validateRequest } from '../../middleware/validation.middleware';
// import { deleteEnrollmentValidation } from '../../validations/course/enrollement/delete.enrollement.validation';

// const enrollmentRoutes = express.Router();

// // Public
// enrollmentRoutes.get('/', getAllEnrollments);
// enrollmentRoutes.get('/:id', getEnrollmentById);

// // Protected
// enrollmentRoutes.post(
//   '/',
//   isAuthenticate,
//   authorizeRoles('admin', 'user'),
//   createEnrollmentValidation,
//   validateRequest,
//   enroll
// );

// enrollmentRoutes.delete(
//   '/:id',
//   isAuthenticate,
//   authorizeRoles('admin'),
//   deleteEnrollmentValidation,
//   validateRequest,
//   deleteEnrollment
// );

// export default enrollmentRoutes;
