import { param } from 'express-validator';
import { ValidationChain } from 'express-validator';

export const deleteCategoryValidation: ValidationChain[] = [
  param('id').isMongoId().withMessage('Valid category ID is required'),
];
