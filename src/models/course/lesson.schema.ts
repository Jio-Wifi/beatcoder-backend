import mongoose, { Schema, Document } from "mongoose";


export interface ILesson extends Document {
  title: string;
  content: string;
  videoUrl?: string;
  videoDescription?: string;
  videoDuration?: number; // in seconds
  videoType?: 'mp4' | 'youtube' | 'vimeo'; // source platform
  transcript?: string; // full transcript for accessibility/SEO
  resources?: string[]; // links to PDFs, code files, etc.
  isFreePreview?: boolean;
  course: mongoose.Types.ObjectId;
  order: number;
}

const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    content: { type: String }, 
    videoUrl: { type: String },
    videoDescription: { type: String },
    videoDuration: { type: Number },
    videoType: { type: String, enum: ['mp4', 'youtube', 'vimeo'], default: 'mp4' },
    transcript: { type: String },
    resources: [{ type: String }], 
    isFreePreview: { type: Boolean, default: false },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);


export default mongoose.model<ILesson>("Lesson", lessonSchema);
