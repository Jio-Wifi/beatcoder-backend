import express from "express";
import { isAuthenticate } from "../../middleware/is.authenticate";
import { authorizeRoles } from "../../middleware/authorize.role";
import { validateRequest } from "../../middleware/validation.middleware";

import {
  createPlan,
  getAllPlans,
  startSubscription,
  cancelSubscription,
  checkUserSubscription,
  verifyRazorpayWebhook,
  getRevenue,
  getSettlements,
  getUserSubscriptionDetails,
} from "../../controllers/subscription/subscription.controller";

import { createPlanValidation } from "../../validations/subscription/create.plan.validation";
import { startSubscriptionValidation } from "../../validations/subscription/start.subscription.validation";
import { cancelSubscriptionValidation } from "../../validations/subscription/cancel.subscription.validation";

const subscriptionRoutes = express.Router();


subscriptionRoutes.post(
  "/plans",
  isAuthenticate,
  authorizeRoles("admin"),
  createPlanValidation,
  validateRequest,
  createPlan
);


subscriptionRoutes.get("/plans", getAllPlans);


subscriptionRoutes.post(
  "/start",
  isAuthenticate,
  startSubscriptionValidation,
  validateRequest,
  startSubscription
);

subscriptionRoutes.post(
  "/cancel",
  isAuthenticate,
  cancelSubscriptionValidation,
  validateRequest,
  cancelSubscription
);


subscriptionRoutes.get("/check/:userId", isAuthenticate, checkUserSubscription);


subscriptionRoutes.get(
  "/revenue",
  isAuthenticate,
  authorizeRoles("admin"),
  getRevenue
);
subscriptionRoutes.get(
  "/user/details",
  isAuthenticate,
  getUserSubscriptionDetails
);

subscriptionRoutes.get(
  "/settlements",
  isAuthenticate,
  authorizeRoles("admin"),
  getSettlements
);

subscriptionRoutes.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  verifyRazorpayWebhook
);

export default subscriptionRoutes;
