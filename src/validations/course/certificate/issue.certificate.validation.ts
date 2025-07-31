import { body, ValidationChain } from 'express-validator';

export const issueCertificateValidation: ValidationChain[] = [
  body('user').notEmpty().isMongoId().withMessage('Valid user ID is required'),
  body('course').notEmpty().isMongoId().withMessage('Valid course ID is required'),
  body('certificateUrl').notEmpty().isURL().withMessage('Valid certificate URL is required'),
];
