import Razorpay from "razorpay";
import config from ".";

if (!config.RAZORPAY_KEY_ID || !config.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay API keys are missing. Please set them in your .env file.");
}

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

export default razorpay;
