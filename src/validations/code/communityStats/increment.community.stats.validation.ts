// src/validations/code/communityStats/increment.community.stats.validation.ts
import { body, param } from "express-validator";

export const incrementCommunityStatsValidation = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid User ID"),

  body("views")
    .optional()
    .isInt()
    .withMessage("Views increment must be an integer"),

  body("solutions")
    .optional()
    .isInt()
    .withMessage("Solutions increment must be an integer"),

  body("discussions")
    .optional()
    .isInt()
    .withMessage("Discussions increment must be an integer"),

  body().custom((body) => {
    if (!("views" in body) && !("solutions" in body) && !("discussions" in body)) {
      throw new Error("At least one of 'views', 'solutions', or 'discussions' must be provided");
    }
    return true;
  }),
];
