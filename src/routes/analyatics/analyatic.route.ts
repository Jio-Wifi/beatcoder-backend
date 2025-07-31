import express from "express";
import { isAuthenticate } from "../../middleware/is.authenticate";
import { authorizeRoles } from "../../middleware/authorize.role";
import {
  getAnalyticsOverview,
  getRevenueAnalytics,
  getMonthlySubscriptionsAnalytics,
} from "../../controllers/analyatic/analyatic.controller";

const analyticsRoutes = express.Router();

// Get total dashboard stats (overview)
analyticsRoutes.get(
  "/",
  isAuthenticate,
  authorizeRoles("admin"),
  getAnalyticsOverview
);

// Get simulated revenue analytics (based on subscriptions)
analyticsRoutes.get(
  "/revenue",
  isAuthenticate,
  authorizeRoles("admin"),
  getRevenueAnalytics
);

// Optional: Get monthly subscriptions data (for separate charts)
analyticsRoutes.get(
  "/subscriptions",
  isAuthenticate,
  authorizeRoles("admin"),
  getMonthlySubscriptionsAnalytics
);

export default analyticsRoutes;
