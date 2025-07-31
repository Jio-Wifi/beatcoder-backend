import { body } from 'express-validator';
import { ValidationChain } from 'express-validator';

export const updateLessonValidation: ValidationChain[] = [
  body('title').optional().notEmpty(),
  body('content').optional().isString(),
  body('videoUrl').optional().isURL(),
  body('course').optional().isMongoId(),
  body('order').optional().isInt({ min: 1 }),
];
