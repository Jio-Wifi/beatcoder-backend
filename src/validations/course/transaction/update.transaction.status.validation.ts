import { body, ValidationChain } from 'express-validator';

export const updateTransactionStatusValidation: ValidationChain[] = [
  body('status')
    .notEmpty()
    .isIn(['success', 'failed'])
    .withMessage('Status must be success or failed'),
  body('razorpayPaymentId').optional().isString(),
  body('razorpaySignature').optional().isString(),
];
