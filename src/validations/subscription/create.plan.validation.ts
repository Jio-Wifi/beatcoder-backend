import { body } from "express-validator";

export const createPlanValidation = [
  body("name")
    .notEmpty()
    .withMessage("Plan name is required")
    .isString()
    .withMessage("Plan name must be a string"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isInt({ min: 100 })
    .withMessage("Price must be at least 100 paise (₹1)"),

  body("interval")
    .notEmpty()
    .withMessage("Interval is required")
    .isIn(["month", "year"])
    .withMessage("Interval must be either 'month' or 'year'"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];
