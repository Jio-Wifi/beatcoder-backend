import { body,ValidationChain } from 'express-validator';

export const updateProgressValidation: ValidationChain[] = [
  body('completedLessons').optional().isArray().withMessage('completedLessons must be an array'),
];
