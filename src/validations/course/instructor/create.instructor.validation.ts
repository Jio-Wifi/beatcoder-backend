import { body } from 'express-validator';

export const createInstructorValidation = [
  body('user').notEmpty().isMongoId().withMessage('Valid user ID is required'),
  body('bio').notEmpty().isString().withMessage('Bio is required'),
  body('expertise')
    .isArray({ min: 1 })
    .withMessage('Expertise must be a non-empty array of strings'),
];
