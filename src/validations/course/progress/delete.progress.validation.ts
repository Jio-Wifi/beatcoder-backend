import { param,ValidationChain } from 'express-validator';

export const deleteProgressValidation: ValidationChain[] = [
  param('id').isMongoId().withMessage('Valid progress ID is required'),
];
