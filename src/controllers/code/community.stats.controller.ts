import { Request, Response } from "express";
import catchAsync from "../../utils/catch.async";
import CommunityStatsService from "../../service/code/community.stats.service";

// Utility to safely extract the logged-in user's ID
const getLoggedInUserId = (req: Request): string => {
  const user = (req as any).user;
  return user?._id;
};

// --- Create stats for a user (auto at registration or admin override) ---
export const createCommunityStats = catchAsync(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserId(req);

  // Allow admin to create for other users
  const targetUserId =
    req.body.userId && (req as any).user?.role === "admin"
      ? req.body.userId
      : loggedInUserId;

  const stats = await CommunityStatsService.createStats({ user: targetUserId });
  res.status(201).json({ stats });
});

// --- Get stats for the logged-in user ---
export const getCommunityStats = catchAsync(async (req: Request, res: Response) => {
  const userId = getLoggedInUserId(req);
  const stats = await CommunityStatsService.getStatsByUser(userId);

  res.json({ stats });
});

// --- Update stats (views, solutions, discussions) ---
export const updateCommunityStats = catchAsync(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserId(req);

  // Admin can update another user's stats
  const targetUserId =
    req.params.userId && (req as any).user?.role === "admin"
      ? req.params.userId
      : loggedInUserId;

  const allowedFields = (({ views, solutions, discussions }) => ({
    views,
    solutions,
    discussions,
  }))(req.body);

  const stats = await CommunityStatsService.updateStats(targetUserId, allowedFields);
  res.json({ stats });
});

// --- Increment counters (+1 view, +1 solution, etc.) ---
export const incrementCommunityStats = catchAsync(async (req: Request, res: Response) => {
  const loggedInUserId = getLoggedInUserId(req);

  // Admin can increment for another user
  const targetUserId =
    req.params.userId && (req as any).user?.role === "admin"
      ? req.params.userId
      : loggedInUserId;

  const allowedIncrements = (({ views, solutions, discussions }) => ({
    views,
    solutions,
    discussions,
  }))(req.body);

  const stats = await CommunityStatsService.incrementStats(targetUserId, allowedIncrements);
  res.json({ stats });
});

// --- Delete stats (admins only) ---
export const deleteCommunityStats = catchAsync(async (req: Request, res: Response) => {
  const { user } = req as any;

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  await CommunityStatsService.deleteStats(req.params.userId);
  res.status(204).send();
});
