// import mongoose, { Schema, Document } from "mongoose";

// export interface ITransaction extends Document {
//   user: mongoose.Types.ObjectId;
//   course: mongoose.Types.ObjectId;
//   amount: number; // in INR
//   status: "pending" | "success" | "failed";
//   paymentMethod: string;
//   razorpayOrderId?: string;
//   razorpayPaymentId?: string;
//   razorpaySignature?: string;
//   receipt?: string;
//   currency: string;
// }

// const transactionSchema = new Schema<ITransaction>(
//   {
//     user: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
//     amount: { type: Number, required: true }, // INR
//     currency: { type: String, default: "INR" },

//     status: {
//       type: String,
//       enum: ["pending", "success", "failed"],
//       default: "pending",
//     },

//     paymentMethod: { type: String }, // Razorpay, UPI, Card, etc.

//     // Razorpay specific fields
//     razorpayOrderId: { type: String },
//     razorpayPaymentId: { type: String },
//     razorpaySignature: { type: String },

//     receipt: { type: String }, // Optional receipt id
//   },
//   { timestamps: true }
// );

// export default mongoose.model<ITransaction>("Transaction", transactionSchema);
