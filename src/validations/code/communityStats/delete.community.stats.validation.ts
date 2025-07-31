import { param } from "express-validator";

export const deleteCommunityStatsValidation = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID"),
];
