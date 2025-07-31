import mongoose, { Schema, Document } from "mongoose";

export interface ICertificate extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  issuedAt: Date;
  certificateUrl: string;
}

const certificateSchema = new Schema<ICertificate>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    issuedAt: { type: Date, default: Date.now },
    certificateUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICertificate>("Certificate", certificateSchema);
