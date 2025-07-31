import { body } from 'express-validator';
import { ValidationChain } from 'express-validator';

export const createLessonValidation: ValidationChain[] = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').optional().isString(),
  body('videoUrl').optional().isURL().withMessage('Must be a valid URL'),
  body('course').isMongoId().withMessage('Valid course ID is required'),
  body('order').isInt({ min: 1 }).withMessage('Order must be a positive integer'),
];
