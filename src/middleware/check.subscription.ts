// src/middleware/check.subscription.ts
import { Request, Response, NextFunction } from "express";
import SubscriptionService from "../service/subscription/subscription.service";

export const checkSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const userId = user._id; 

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please log in",
      });
    }

    const isSubscribed = await SubscriptionService.isUserSubscribed(userId);

    if (!isSubscribed) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Active subscription required",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while checking subscription",
    });
  }
};
