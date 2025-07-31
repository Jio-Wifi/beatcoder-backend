import { body, ValidationChain } from 'express-validator';

export const createSubmissionValidation: ValidationChain[] = [
  body('problem')
    .notEmpty().withMessage('Problem ID is required')
    .isMongoId().withMessage('Problem must be a valid MongoDB ObjectId'),

  body('code')
    .notEmpty().withMessage('Code is required')
    .isString().withMessage('Code must be a string'),

  body('language')
    .notEmpty().withMessage('Language is required')
    .isString().withMessage('Language must be a string'),

  body('executionTime')
    .optional()
    .isNumeric().withMessage('Execution time must be a number (ms)')
    .toFloat(),

  body('memory')
    .optional()
    .isNumeric().withMessage('Memory must be a number (KB)')
    .toFloat(),
];
