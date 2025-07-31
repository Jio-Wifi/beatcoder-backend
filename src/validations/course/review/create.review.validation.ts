import { body } from 'express-validator';
import { ValidationChain } from 'express-validator';

export const createReviewValidation: ValidationChain[] = [
  body('user').notEmpty().isMongoId().withMessage('Valid user ID is required'),
  body('course').notEmpty().isMongoId().withMessage('Valid course ID is required'),
  body('rating')
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().withMessage('Comment must be a string'),
];
