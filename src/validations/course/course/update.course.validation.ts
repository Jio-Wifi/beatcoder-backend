import { body } from 'express-validator';
import { ValidationChain } from 'express-validator';

export const updateCourseValidation: ValidationChain[] = [
  body('title').optional().isString().withMessage('Title must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('category').optional().isMongoId().withMessage('Category must be a valid Mongo ID'),
  body('lessons')
    .optional()
    .isArray()
    .withMessage('Lessons must be an array of IDs'),
  body('lessons.*')
    .optional()
    .isMongoId()
    .withMessage('Each lesson must be a valid Mongo ID'),
  body('instructor').optional().isMongoId().withMessage('Instructor must be a valid Mongo ID'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
];