import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
  course: mongoose.Types.ObjectId;
  question: string;
  options: string[];
  correctAnswer: string;
}

const quizSchema = new Schema<IQuiz>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    question: { type: String },
    options: [{ type: String }],
    correctAnswer: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IQuiz>("Quiz", quizSchema);
