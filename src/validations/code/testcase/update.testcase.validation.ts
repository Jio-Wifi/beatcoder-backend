import { body, ValidationChain } from 'express-validator';

export const updateTestCaseValidation: ValidationChain[] = [
  // input: optional, must be a string if provided
  body('input')
    .optional()
    .isString()
    .withMessage('Input must be a string'),

  // expectedOutput: optional, must be a string if provided
  body('expectedOutput')
    .optional()
    .isString()
    .withMessage('Expected output must be a string'),

  // isPublic: optional, must be boolean if provided
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),

  // problem: optional, must be a valid ObjectId
  body('problem')
    .optional()
    .isMongoId()
    .withMessage('Problem must be a valid MongoDB ObjectId'),
  body('createdBy')
    .optional()
    .isMongoId()
    .withMessage('createdBy must be a valid MongoDB ObjectId'),
];
