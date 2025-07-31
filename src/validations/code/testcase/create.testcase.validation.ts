// validators/testCaseValidation.ts
import { body, ValidationChain } from 'express-validator';

export const createTestCaseValidation: ValidationChain[] = [
  // input: required, must be a non-empty string
  body('input')
    .notEmpty()
    .withMessage('Input is required')
    .isString()
    .withMessage('Input must be a string'),

  // expectedOutput: required, must be a non-empty string
  body('expectedOutput')
    .notEmpty()
    .withMessage('Expected output is required')
    .isString()
    .withMessage('Expected output must be a string'),

  // isPublic: optional, must be boolean if provided
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),

  // problem: required, must be a valid MongoDB ObjectId
  body('problem')
    .notEmpty()
    .withMessage('Problem ID is required')
    .isMongoId()
    .withMessage('Problem ID must be a valid MongoDB ObjectId'),
];
