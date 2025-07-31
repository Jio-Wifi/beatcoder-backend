import { body } from 'express-validator';
import { ValidationChain } from 'express-validator';

export const createCategoryValidation: ValidationChain[] = [
  body('name').notEmpty().withMessage('Name is required'),
];
