import razorpay from "../config/razorpay";

export async function createPlan(
  name: string,
  amount: number,
  interval: "month" | "year"
) {
  // Map interval to Razorpay’s accepted values
  const period = interval === "month" ? "monthly" : "yearly";

  return await razorpay.plans.create({
    period, // "monthly" or "yearly"
    interval: 1, // every 1 period
    item: {
      name,
      amount, // in paise (₹35 = 3500)
      currency: "INR",
    },
  });
}

// Start a subscription for a user
export async function createSubscription(planId: string, totalCount = 12) {
  return await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: totalCount,  // e.g., 12 months
  });
}
