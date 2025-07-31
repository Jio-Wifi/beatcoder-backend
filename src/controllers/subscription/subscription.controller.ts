import { Request, Response } from "express";
import catchAsync from "../../utils/catch.async";
import SubscriptionService from "../../service/subscription/subscription.service";


export const createPlan = catchAsync(async (req: Request, res: Response) => {
  const { name, price, interval, description } = req.body;

  const plan = await SubscriptionService.createSubscriptionPlan(
    name,
    price,
    interval,
    description
  );

  res.status(201).json({
    success: true,
    message: "Subscription plan created successfully",
    data: plan,
  });
});


export const getAllPlans = catchAsync(async (_req: Request, res: Response) => {
  const plans = await SubscriptionService.getAllPlans();
  res.status(200).json({ success: true, data: plans });
});


export const startSubscription = catchAsync(async (req: Request, res: Response) => {
  const { userId, planId } = req.body;

  if (!userId || !planId) {
    return res.status(400).json({
      success: false,
      message: "userId and planId are required",
    });
  }

  const subscription = await SubscriptionService.startUserSubscription(userId, planId);
  res.status(201).json({
    success: true,
    message: "Subscription started successfully",
    data: subscription,
  });
});


export const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const { razorpaySubscriptionId } = req.body;

  if (!razorpaySubscriptionId) {
    return res.status(400).json({
      success: false,
      message: "razorpaySubscriptionId is required",
    });
  }

  const subscription = await SubscriptionService.cancelUserSubscription(razorpaySubscriptionId);
  res.status(200).json({
    success: true,
    message: "Subscription cancelled successfully",
    data: subscription,
  });
});


export const checkUserSubscription = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  const isSubscribed = await SubscriptionService.isUserSubscribed(userId);
  res.status(200).json({ success: true, isSubscribed });
});


export const verifyRazorpayWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["x-razorpay-signature"] as string;

  if (!signature) {
    return res.status(400).json({
      success: false,
      message: "Missing Razorpay signature",
    });
  }

  await SubscriptionService.verifyRazorpayWebhook(req.body, signature);

  res.status(200).json({
    success: true,
    message: "Webhook processed successfully",
  });
});


export const getRevenue = catchAsync(async (_req: Request, res: Response) => {
  const dbRevenue = await SubscriptionService.getRevenueFromDB();
  const razorpayRevenue = await SubscriptionService.getRevenueFromRazorpay();

  res.status(200).json({
    success: true,
    revenue: {
      database: dbRevenue,
      razorpay: razorpayRevenue,
      total: dbRevenue + razorpayRevenue,
    },
  });
});


export const getSettlements = catchAsync(async (_req: Request, res: Response) => {
  const { total, settlements } = await SubscriptionService.getSettlements();

  res.status(200).json({
    success: true,
    totalPayout: total,
    settlements,
  });
});


/** NEW: Get full subscription details for a user */
export const getUserSubscriptionDetails = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user
  const userId = user._id;

  const details = await SubscriptionService.getUserSubscriptionDetails(userId);

  res.status(200).json({ success: true, data: details });
});