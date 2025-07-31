import mongoose, { Schema, Document } from "mongoose";

export interface ICommunityStats extends Document {
  user: mongoose.Types.ObjectId;
  views: number;
  solutions: number;
  discussions: number;
  rank: number;          
  createdAt: Date;
  updatedAt: Date;
}

const CommunityStatsSchema = new Schema<ICommunityStats>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    views: { type: Number, default: 0 },
    solutions: { type: Number, default: 0 },
    discussions: { type: Number, default: 0 },
    rank: { type: Number, default: 0 }, // Default rank
  },
  { timestamps: true }
);



const CommunityStats = mongoose.model<ICommunityStats>("CommunityStats", CommunityStatsSchema);
export default CommunityStats;
