import mongoose, { Document, Schema } from 'mongoose';

export interface IProblem extends Document {
  title: string;
  slug: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  testCases: mongoose.Types.ObjectId[];
  constraints: string;
  subject: string;
  starterCode: {
    [language: string]: string;
  };
  videoSolutions: {
    title: string;
    url: string;
    duration?: string;
    language?: string;
    codeLanguage?: string; 
    isPremium?: boolean;
    thumbnail?: string;
    description?: string;
    uploadedBy?: string;
    createdAt?: Date;
  }[];
  createdAt: Date;
}

const VideoSolutionSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  duration: { type: String },
  language: { type: String, default: 'English' },
  codeLanguage: { type: String, enum: ['C++', 'JavaScript', 'Python', 'Java'], default: 'C++' },
  isPremium: { type: Boolean, default: false },
  thumbnail: { type: String },
  description: { type: String },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const ProblemSchema = new Schema<IProblem>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  },
  testCases: [
    {
      type: Schema.Types.ObjectId,
      ref: 'TestCase',
    },
  ],
  constraints: { type: String },
  subject: { 
    type: String, 
    required: true,
    enum: [
      'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Hashing',
      'Trees', 'Graphs', 'Recursion', 'Dynamic Programming', 'Greedy',
      'Heap', 'Trie', 'Sorting & Searching', 'Bit Manipulation'
    ],
  },
  starterCode: {
    type: Map,
    of: String,
    default: {},
  },
  videoSolutions: [VideoSolutionSchema], // Updated with codeLanguage
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Problem = mongoose.model<IProblem>('Problem', ProblemSchema);
export default Problem;
