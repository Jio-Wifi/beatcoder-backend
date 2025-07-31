import { body, cookie, ValidationChain } from 'express-validator';

export const updateProfileValidation: ValidationChain[] = [
  // Ensure refresh token exists (for auth)
  cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),

  // Name
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),

  // Email
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),

  // Gender
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),

  // Location
  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string'),

  // Birthday
  body('birthday')
    .optional()
    .isISO8601()
    .withMessage('Birthday must be a valid date'),

  // Summary
  body('summary')
    .optional()
    .isString()
    .withMessage('Summary must be a string'),

  // Website
  body('website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL'),

  // GitHub
  body('github')
    .optional()
    .isURL()
    .withMessage('GitHub must be a valid URL'),

  // LinkedIn
  body('linkedin')
    .optional()
    .isURL()
    .withMessage('LinkedIn must be a valid URL'),

  // Twitter
  body('twitter')
    .optional()
    .isURL()
    .withMessage('Twitter must be a valid URL'),

  // Work
  body('work')
    .optional()
    .isString()
    .withMessage('Work must be a string'),

  // Education
  body('education')
    .optional()
    .isString()
    .withMessage('Education must be a string'),

  // Skills: must be an array of strings
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array of strings')
    .custom((arr: any[]) => arr.every((item) => typeof item === 'string'))
    .withMessage('Each skill must be a string'),
];
