import { param } from 'express-validator';
import { ValidationChain } from 'express-validator';

export const deleteReviewValidation: ValidationChain[] = [
  param('id').isMongoId().withMessage('Valid review ID is required'),
];
