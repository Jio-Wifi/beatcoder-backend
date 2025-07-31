import { cookie, ValidationChain } from 'express-validator';

export const profileValidation: ValidationChain[] = [
  cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
];

