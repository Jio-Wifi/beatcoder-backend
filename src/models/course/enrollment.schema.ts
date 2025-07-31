// import mongoose, { Schema, Document } from "mongoose";


// export interface IEnrollment extends Document {
//   user: mongoose.Types.ObjectId;
//   course: mongoose.Types.ObjectId;
//   enrolledAt: Date;
// }

// const enrollmentSchema = new Schema<IEnrollment>(
//   {
//     user: { type: Schema.Types.ObjectId, ref: "User" },
//     course: { type: Schema.Types.ObjectId, ref: "Course" },
//     enrolledAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);
