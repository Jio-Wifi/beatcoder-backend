import { body } from 'express-validator';
import { ValidationChain } from 'express-validator';

export const updateCategoryValidation: ValidationChain[] = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('slug').optional().notEmpty().withMessage('Slug cannot be empty'),
];
