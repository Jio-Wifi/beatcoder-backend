import { body, ValidationChain } from "express-validator";

export const validateRunCode: ValidationChain[] = [
  body("language")
    .notEmpty()
    .withMessage("Language is required")
    .isString()
    .withMessage("Language must be a string"),

  body("code")
    .notEmpty()
    .withMessage("Code is required")
    .isString()
    .withMessage("Code must be a string"),

  body("input")
    .optional()
    .isString()
    .withMessage("Input must be a string"),
];
