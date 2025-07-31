import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description?: string;
  category?: mongoose.Types.ObjectId;
  lessons?: mongoose.Types.ObjectId[];
  instructor?: mongoose.Types.ObjectId;
  price?: number;
  isPublished?: boolean;
  rating?: number;
  videoUrl?: string;     
  thumbnailUrl?: string; 
  createdAt?: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    instructor: { type: Schema.Types.ObjectId, ref: 'Instructor' },
    price: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    videoUrl: { type: String },     
    thumbnailUrl: { type: String }, 
  },
  { timestamps: true }
);

export default mongoose.model<ICourse>('Course', courseSchema);
