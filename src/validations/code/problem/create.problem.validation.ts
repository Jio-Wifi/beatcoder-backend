import { body, ValidationChain } from "express-validator";

export const createProblemValidation: ValidationChain[] = [
  // Title: Required and non-empty
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Title must be at least 5 characters long'),

  // Description: Required
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),

  // Difficulty: Required and must be from enum
  body('difficulty')
    .notEmpty()
    .withMessage('Difficulty is required')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be one of: easy, medium, hard'),

  // Subject: Required and must match one of the predefined categories
  body('subject')
    .notEmpty()
    .withMessage('Subject is required')
    .isIn([
      'Arrays',
      'Strings',
      'Linked List',
      'Stack',
      'Queue',
      'Hashing',
      'Trees',
      'Graphs',
      'Recursion',
      'Dynamic Programming',
      'Greedy',
      'Heap',
      'Trie',
      'Sorting & Searching',
      'Bit Manipulation'
    ])
    .withMessage('Invalid subject. Must be a valid DSA category'),

  // Constraints: Optional but must be a string
  body('constraints')
    .optional()
    .isString()
    .withMessage('Constraints must be a string'),

  // TestCases: Optional but must be an array of valid Mongo ObjectIds
  body('testCases')
    .optional()
    .isArray()
    .withMessage('TestCases must be an array'),

  body('testCases.*')
    .optional()
    .isMongoId()
    .withMessage('Each test case ID must be a valid MongoDB ObjectId'),
];
