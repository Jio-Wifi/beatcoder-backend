import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", reviewSchema);
