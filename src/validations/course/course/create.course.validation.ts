import { body } from 'express-validator';
import { ValidationChain } from 'express-validator';

export const createCourseValidation: ValidationChain[] = [
  // Required title
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),

  // Optional description
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  // Optional but if provided, must be a valid MongoDB ObjectId
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Category must be a valid Mongo ID'),

  // Optional lessons array
  body('lessons')
    .optional()
    .isArray()
    .withMessage('Lessons must be an array'),

  body('lessons.*')
    .optional()
    .isMongoId()
    .withMessage('Each lesson must be a valid Mongo ID'),

  // Optional instructor ID
  body('instructor')
    .optional()
    .isMongoId()
    .withMessage('Instructor must be a valid Mongo ID'),

  // Required price
  // body('price')
  //   .notEmpty()
  //   .withMessage('Price is required')
  //   .isFloat({ min: 0 })
  //   .withMessage('Price must be a non-negative number'),

  body('price')
  .optional() // field is not required
  .isFloat({ min: 0 })
  .withMessage('Price must be a non-negative number'),

  // Optional isPublished
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),

  // Optional rating
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
];
