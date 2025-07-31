import { param } from 'express-validator';
import { ValidationChain } from 'express-validator';

export const deleteCourseValidation: ValidationChain[] = [
  param('id').isMongoId().withMessage('Valid course ID is required'),
];
