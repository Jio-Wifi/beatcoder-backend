import { param } from 'express-validator';

export const deleteProblemValidation = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Problem slug is required')
    .isSlug()
    .withMessage('Invalid slug format'),
];
