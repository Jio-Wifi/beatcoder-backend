import { body, ValidationChain } from 'express-validator';

export const createQuizValidation: ValidationChain[] = [
  body('course').notEmpty().isMongoId().withMessage('Valid course ID is required'),
  body('question').notEmpty().withMessage('Question is required'),
  body('options')
    .isArray({ min: 2 })
    .withMessage('Options must be an array with at least 2 items'),
  body('correctAnswer').notEmpty().withMessage('Correct answer is required'),
];
