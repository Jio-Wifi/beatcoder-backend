import mongoose, { Document, Schema } from 'mongoose';

export interface ITestCase extends Document {
  input: string;
  expectedOutput: string;
  isPublic: boolean;
  problem: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId; 
}

const TestCaseSchema = new Schema<ITestCase>(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    problem: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true, 
    },
  },
  { timestamps: true }
);

const TestCase = mongoose.model<ITestCase>('TestCase', TestCaseSchema);
export default TestCase;
