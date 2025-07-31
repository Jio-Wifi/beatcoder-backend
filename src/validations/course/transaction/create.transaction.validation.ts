import { body, ValidationChain } from 'express-validator';

export const createTransactionValidation: ValidationChain[] = [
  body('user').notEmpty().isMongoId().withMessage('User ID is required'),
  body('course').notEmpty().isMongoId().withMessage('Course ID is required'),
  body('amount').notEmpty().isNumeric().withMessage('Amount must be a number'),
  body('paymentMethod').notEmpty().isString().withMessage('Payment method is required'),
];
