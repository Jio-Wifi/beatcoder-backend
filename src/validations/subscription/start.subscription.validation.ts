import { body, ValidationChain } from "express-validator";

export const startSubscriptionValidation: ValidationChain[] = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required"),
  body("planId")
    .notEmpty()
    .withMessage("Plan ID is required"),
];
