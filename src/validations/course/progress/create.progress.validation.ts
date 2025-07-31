import { body,ValidationChain } from 'express-validator';


export const createProgressValidation: ValidationChain[] = [
  body('user').notEmpty().isMongoId().withMessage('Valid user ID is required'),
  body('course').notEmpty().isMongoId().withMessage('Valid course ID is required'),
  body('completedLessons').isArray().withMessage('completedLessons must be an array of IDs'),
];
