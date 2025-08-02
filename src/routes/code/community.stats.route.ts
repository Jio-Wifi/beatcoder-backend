import express from "express";
import { validateRequest } from "../../middleware/validation.middleware";
import { isAuthenticate } from "../../middleware/is.authenticate";
import { authorizeRoles } from "../../middleware/authorize.role";

import {
  createCommunityStats,
  getCommunityStats,
  updateCommunityStats,
  incrementCommunityStats,
  deleteCommunityStats,
} from "../../controllers/code/community.stats.controller";

import { createCommunityStatsValidation } from "../../validations/code/communityStats/create.community.stats.validation";
import { updateCommunityStatsValidation } from "../../validations/code/communityStats/update.community.stats.validation";
import { deleteCommunityStatsValidation } from "../../validations/code/communityStats/delete.community.stats.validation";
import { incrementCommunityStatsValidation } from "../../validations/code/communityStats/increment.community.stats.validation";

const communityStatsRoutes = express.Router();


communityStatsRoutes.post(
  "/stats",
  isAuthenticate,
  
  createCommunityStatsValidation, // Only validates optional userId (admins only)
  validateRequest,
  createCommunityStats
);


communityStatsRoutes.get("/stats/me", isAuthenticate, getCommunityStats);


communityStatsRoutes.put(
  "/stats",
  isAuthenticate,
  updateCommunityStatsValidation,
  validateRequest,
  updateCommunityStats
);


communityStatsRoutes.patch(
  "/stats",
  isAuthenticate,
  incrementCommunityStatsValidation,
  validateRequest,
  incrementCommunityStats
);


communityStatsRoutes.delete(
  "/stats",
  isAuthenticate,
  authorizeRoles("admin"), // Only admins can delete
  deleteCommunityStatsValidation,
  validateRequest,
  deleteCommunityStats
);

export default communityStatsRoutes;
