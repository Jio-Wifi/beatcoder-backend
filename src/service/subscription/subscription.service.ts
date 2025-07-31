import mongoose from "mongoose";
import crypto from "crypto";
import CustomError from "../../utils/custom.error";
import razorpay from "../../config/razorpay";
import SubscriptionPlan, { ISubscriptionPlan } from "../../models/subscription/subscription.schema";
import UserSubscription, { IUserSubscription } from "../../models/subscription/user.subscription.schema";
import config from "../../config";

const RAZORPAY_WEBHOOK_SECRET = config.RAZORPAY_WEBHOOK_SECRET;

class SubscriptionService {
  /**
   * Admin creates a new subscription plan (Razorpay + MongoDB).
   */
  async createSubscriptionPlan(
    name: string,
    price: number, // in paise (₹100 = 10000)
    interval: "month" | "year",
    description?: string
  ): Promise<ISubscriptionPlan> {
    const existing = await SubscriptionPlan.findOne({ name });
    if (existing) {
      throw new CustomError("A subscription plan with this name already exists", 409);
    }

    const period = interval === "month" ? "monthly" : "yearly";

    const razorpayPlan = await razorpay.plans.create({
      period,
      interval: 1,
      item: { name, amount: price, currency: "INR" },
    });

    return await SubscriptionPlan.create({
      name,
      price,
      interval,
      description,
      razorpayPlanId: razorpayPlan.id,
    });
  }

  /** Get all plans for frontend */
  async getAllPlans(): Promise<ISubscriptionPlan[]> {
    return await SubscriptionPlan.find();
  }

  /**
   * Start a subscription for a user.
   */
  async startUserSubscription(userId: string, planId: string): Promise<IUserSubscription> {
    if (!mongoose.Types.ObjectId.isValid(planId)) {
      throw new CustomError("Invalid plan ID", 400);
    }

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan || !plan.razorpayPlanId) {
      throw new CustomError("Subscription plan not found", 404);
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.razorpayPlanId,
      customer_notify: 1,
      total_count: plan.interval === "month" ? 1 : 12,
    });

    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + (plan.interval === "month" ? 30 : 365) * 24 * 60 * 60 * 1000
    );

    return await UserSubscription.create({
      userId,
      planId,
      razorpaySubscriptionId: subscription.id,
      startDate,
      endDate,
      amount: plan.price, 
      status: "pending",
    });
  }

  /** Cancel an active subscription */
  async cancelUserSubscription(subscriptionId: string): Promise<IUserSubscription> {
    const subscription = await UserSubscription.findOne({
      razorpaySubscriptionId: subscriptionId,
      status: "active",
    });
    if (!subscription) throw new CustomError("Active subscription not found", 404);

    await razorpay.subscriptions.cancel(subscriptionId);
    subscription.status = "cancelled";
    await subscription.save();

    return subscription;
  }

  /** Check if user has an active subscription */
  async isUserSubscribed(userId: string): Promise<boolean> {
    const activeSub = await UserSubscription.findOne({
      userId,
      status: "active",
      endDate: { $gte: new Date() },
    });
    return !!activeSub;
  }

  /**
   * Verify Razorpay Webhook Signature, Update Subscription Status.
   */
  async verifyRazorpayWebhook(payload: any, signature: string): Promise<void> {
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest("hex");

    if (expectedSignature !== signature) {
      throw new CustomError("Invalid Razorpay signature", 400);
    }

    const event = payload.event;
    const subscriptionId =
      payload.payload?.subscription?.entity?.id ||
      payload.payload?.payment?.entity?.subscription_id;

    if (!subscriptionId) {
      throw new CustomError("Invalid webhook payload", 400);
    }

    if (event === "subscription.activated") {
      await UserSubscription.findOneAndUpdate(
        { razorpaySubscriptionId: subscriptionId },
        { status: "active" },
        { new: true }
      );
    }

    if (event === "subscription.cancelled") {
      await UserSubscription.findOneAndUpdate(
        { razorpaySubscriptionId: subscriptionId },
        { status: "cancelled" },
        { new: true }
      );
    }

    if (event === "payment.failed") {
      await UserSubscription.findOneAndUpdate(
        { razorpaySubscriptionId: subscriptionId },
        { status: "expired" },
        { new: true }
      );
    }
  }

  /** Calculate total revenue from your DB (active and completed subscriptions) */
  async getRevenueFromDB(): Promise<number> {
    const result = await UserSubscription.aggregate([
      { $match: { status: { $in: ["active", "expired", "cancelled"] } } }, 
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    return result.length ? result[0].total / 100 : 0; // Convert paise → ₹
  }

  /** Get total revenue directly from Razorpay (real-time, gross) */
  async getRevenueFromRazorpay(): Promise<number> {
    const payments = await razorpay.payments.all({ from: 0, count: 100 });
    const successfulPayments = payments.items.filter(p => p.status === "captured");
    return successfulPayments.reduce((acc, p) => acc + Number(p.amount), 0) / 100;

  }

  /** Get settlements (actual credited to bank) */
  async getSettlements(): Promise<{ total: number; settlements: any[] }> {
    const settlements = await razorpay.settlements.all({ count: 50 });
    return {
      total: settlements.items.reduce((acc, s) => acc + Number(s.amount), 0) / 100,
      settlements: settlements.items,
    };
  }

   /** Get full subscription details for a user (plan + status) */
  async getUserSubscriptionDetails(userId: mongoose.Types.ObjectId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", 400);
    }

    const subscription = await UserSubscription.findOne({
      userId,
      status: "active",
      endDate: { $gte: new Date() },
    }).populate("planId");

    if (!subscription) return null;

    const plan = subscription.planId as any;

    return {
      userId: subscription.userId,
      planName: plan?.name || "Unknown Plan",
      interval: plan?.interval || "month",
      price: plan?.price || 0,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      status: subscription.status,
    };
  }
}

export default new SubscriptionService();
