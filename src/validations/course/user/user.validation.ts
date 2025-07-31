import { body, param } from "express-validator";
import { ValidationChain } from "express-validator";

// Validate :id param for routes (for GET, PUT, DELETE)
export const validateUserId: ValidationChain[] = [
  param("id")
    .notEmpty()
    .isMongoId()
    .withMessage("Valid user ID is required"),
];

// Validate body fields when updating a user
export const validateUpdateUser: ValidationChain[] = [
  body("name")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  body("location").optional().isString().trim(),
  body("birthday").optional().isString(),
  body("summary").optional().isString(),
  body("website").optional().isString(),
  body("github").optional().isString(),
  body("linkedin").optional().isString(),
  body("twitter").optional().isString(),
  body("work").optional().isString(),
  body("education").optional().isString(),
  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array of strings"),
];
