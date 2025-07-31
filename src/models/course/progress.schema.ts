import mongoose, { Schema, Document } from "mongoose";


export interface IProgress extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  completedLessons: mongoose.Types.ObjectId[];
}

const progressSchema = new Schema<IProgress>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    completedLessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  },
  { timestamps: true }
);

export default mongoose.model<IProgress>("Progress", progressSchema);
