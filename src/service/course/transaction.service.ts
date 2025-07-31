// // service/course/transaction.service.ts
// import crypto from "crypto";
// import mongoose from "mongoose";
// import Transaction, { ITransaction } from "../../models/course/transaction.schema";
// import CustomError from "../../utils/custom.error";
// import RazorpayUtils from "../../utils/razorpay";
// // 
// interface CreateTransactionInput {
//   user: mongoose.Types.ObjectId;
//   course: mongoose.Types.ObjectId;
//   amount: number;
//   paymentMethod: string;
//   currency?: string;
// }

// class TransactionService {
//   async createTransaction(data: CreateTransactionInput) {
//     const receipt = `receipt_${Date.now()}`;
//     const currency = data.currency || "INR";

//     const razorpayOrder = await RazorpayUtils.createOrder({
//       amount: data.amount * 100,
//       currency,
//       receipt,
//     });

//     const transaction = await Transaction.create({
//       user: data.user,
//       course: data.course,
//       amount: data.amount,
//       currency,
//       paymentMethod: data.paymentMethod,
//       status: "pending",
//       razorpayOrderId: razorpayOrder.id,
//       receipt,
//     });

//     return { razorpayOrder, transaction };
//   }

//   async updateTransactionStatus(
//     transactionId: string,
//     status: "success" | "failed",
//     razorpayPaymentId?: string,
//     razorpaySignature?: string
//   ): Promise<ITransaction> {
//     const transaction = await Transaction.findById(transactionId);
//     if (!transaction) throw new CustomError("Transaction not found", 404);

//     transaction.status = status;
//     if (razorpayPaymentId) transaction.razorpayPaymentId = razorpayPaymentId;
//     if (razorpaySignature) transaction.razorpaySignature = razorpaySignature;

//     await transaction.save();
//     return transaction;
//   }

//   /**
//    * Verify Razorpay payment and update transaction status.
//    */
//   async verifyTransaction(data: {
//     transactionId: string;
//     razorpayOrderId: string;
//     razorpayPaymentId: string;
//     razorpaySignature: string;
//   }): Promise<{ success: boolean; transaction: ITransaction }> {
//     const { transactionId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = data;

//     // Generate signature to verify
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
//       .update(`${razorpayOrderId}|${razorpayPaymentId}`)
//       .digest("hex");

//     const isValid = generatedSignature === razorpaySignature;

//     // Update transaction status accordingly
//     const updatedTransaction = await this.updateTransactionStatus(
//       transactionId,
//       isValid ? "success" : "failed",
//       razorpayPaymentId,
//       razorpaySignature
//     );

//     return { success: isValid, transaction: updatedTransaction };
//   }

//   async getAllTransactions(): Promise<ITransaction[]> {
//     return await Transaction.find().populate("user").populate("course");
//   }

//   async getTransactionById(id: string): Promise<ITransaction> {
//     const transaction = await Transaction.findById(id).populate("user").populate("course");
//     if (!transaction) throw new CustomError("Transaction not found", 404);
//     return transaction;
//   }
// }

// export default new TransactionService();
