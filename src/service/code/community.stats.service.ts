// src/services/community/community.stats.service.ts
import mongoose from "mongoose";
import CommunityStats, { ICommunityStats } from "../../models/code/community.stats.schema";
import CustomError from "../../utils/custom.error";

interface CreateStatsInput {
  user: mongoose.Types.ObjectId;
  views?: number;
  solutions?: number;
  discussions?: number;
}

const calculateRank = (views: number, solutions: number, discussions: number): number => {
  // Example formula (adjustable)
  return views * 0.1 + solutions * 5 + discussions * 2;
};

class CommunityStatsService {
  async createStats(data: CreateStatsInput): Promise<ICommunityStats> {
    const existing = await CommunityStats.findOne({ user: data.user });
    if (existing) throw new CustomError("Community stats already exist for this user", 400);

    const views = data.views ?? 0;
    const solutions = data.solutions ?? 0;
    const discussions = data.discussions ?? 0;

    const rank = calculateRank(views, solutions, discussions);

    return CommunityStats.create({
      user: data.user,
      views,
      solutions,
      discussions,
      rank,
    });
  }

   async getStatsByUser(userId: string): Promise<ICommunityStats> {
    let stats = await CommunityStats.findOne({ user: userId });

    // If no stats exist, create one with default values
    if (!stats) {
      stats = await CommunityStats.create({
        user: userId,
        views: 0,
        solutions: 0,
        discussions: 0,
      });
    }

    return stats;
  }

  async updateStats(userId: string, updates: Partial<ICommunityStats>): Promise<ICommunityStats> {
    const stats = await CommunityStats.findOne({ user: userId });
    if (!stats) throw new CustomError("Community stats not found", 404);

    // Update fields and recalculate rank
    const updated = {
      ...stats.toObject(),
      ...updates,
    };

    updated.rank = calculateRank(updated.views, updated.solutions, updated.discussions);

    const result = await CommunityStats.findOneAndUpdate(
      { user: userId },
      { $set: updated },
      { new: true }
    );

    return result!;
  }

  async incrementStats(
    userId: string,
    increments: Partial<Record<"views" | "solutions" | "discussions", number>>
  ): Promise<ICommunityStats> {
    const stats = await CommunityStats.findOneAndUpdate(
      { user: userId },
      { $inc: increments },
      { new: true, upsert: true }
    );

    if (!stats) throw new CustomError("Community stats not found", 404);

    // Recalculate rank
    stats.rank = calculateRank(stats.views, stats.solutions, stats.discussions);
    await stats.save();

    return stats;
  }

  async deleteStats(userId: string): Promise<void> {
    const result = await CommunityStats.findOneAndDelete({ user: userId });
    if (!result) throw new CustomError("Community stats not found", 404);
  }
}

export default new CommunityStatsService();
