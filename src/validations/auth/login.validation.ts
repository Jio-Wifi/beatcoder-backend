import { body, ValidationChain } from 'express-validator';

export const loginValidation: ValidationChain[] = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .trim()
    .isEmail()
    .withMessage('Invalid email format'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];
