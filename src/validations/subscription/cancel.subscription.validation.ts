import { body } from "express-validator";

export const cancelSubscriptionValidation = [
  body("razorpaySubscriptionId")
    .notEmpty()
    .withMessage("Razorpay Subscription ID is required")
    .isString()
    .withMessage("Razorpay Subscription ID must be a string"),
];
