import { body } from "express-validator";

export const createCommunityStatsValidation = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID"),

  body("views")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Views must be a non-negative integer"),

  body("solutions")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Solutions must be a non-negative integer"),

  body("discussions")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Discussions must be a non-negative integer"),
];
