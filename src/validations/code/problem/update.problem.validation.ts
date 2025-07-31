import { body, ValidationChain } from "express-validator";
import mongoose from "mongoose";

export const updateProblemValidation: ValidationChain[] = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty'),

  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty'),

  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty value'),

  // Subject: Optional but must match valid DSA categories if provided
  body('subject')
    .optional()
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

  body('constraints')
    .optional()
    .isString()
    .withMessage('Constraints must be a string'),

  body('testCases')
    .optional()
    .isArray()
    .withMessage('TestCases must be an array')
    .custom((value) => {
      return value.every((id: string) => mongoose.Types.ObjectId.isValid(id));
    })
    .withMessage('Each testCase ID must be a valid ObjectId'),
];
