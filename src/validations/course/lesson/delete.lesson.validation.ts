import { param } from 'express-validator';
import { ValidationChain } from 'express-validator';

export const deleteLessonValidation: ValidationChain[] = [
  param('id').isMongoId().withMessage('Valid lesson ID is required'),
];
