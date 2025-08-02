import Submission, { ISubmission } from "../../models/code/submission.schema";
import Problem from "../../models/code/problem.schema";
import CustomError from "../../utils/custom.error";
import mongoose from "mongoose";
import CommunityStats from "../../models/code/community.stats.schema";

interface CreateSubmissionInput {
  user: mongoose.Types.ObjectId;
  problem: mongoose.Types.ObjectId;
  code: string;
  language: string;
}

class SubmissionService {

  async createSubmission(data: CreateSubmissionInput): Promise<ISubmission> {
    const problemExists = await Problem.findById(data.problem);
    if (!problemExists) {
      throw new CustomError("Problem not found", 404);
    }

    const submission = await Submission.create({
      ...data,
      status: "Pending",
    });

  if (submission.status === "Accepted") {
    await CommunityStats.findOneAndUpdate(
      { user: submission.user },
      { $inc: { solutions: 1 } },
      { upsert: true, new: true }
    );
  }


    return submission;
  }

  
  async updateSubmissionResult(
    id: string,
    result: Partial<
      Pick<
        ISubmission,
        "status" | "output" | "error" | "executionTime" | "memory"
      >
    >
  ): Promise<ISubmission> {
    const updated = await Submission.findByIdAndUpdate(id, result, {
      new: true,
    });
    if (!updated) {
      throw new CustomError("Submission not found to update", 404);
    }
    return updated;
  }


  async getUserSubmissions(userId: string) {
    return Submission.find({ user: userId }).populate("problem");
  }

  async getProblemSubmissionsRawFields(slug: string) {
    const problem = await Problem.findOne({ slug });
    if (!problem) {
      throw new CustomError("Problem not found", 404);
    }

    const submissions = await Submission.find({ problem: problem._id })
      .select(
        "user problem code language status output error createdAt executionTime memory"
      )
      .sort({ createdAt: -1 });

    return {
      problemId: problem._id,
      submissions,
    };
  }


  async getSubmissionById(id: string) {
    const submission = await Submission.findById(id)
      .populate("user")
      .populate("problem");
    if (!submission) {
      throw new CustomError("Submission not found", 404);
    }
    return submission;
  }

   async getMySubmissionsBySlugField (slug: string, userId: string) {
     const problem = await Problem.findOne({ slug });

  if (!problem) {
    throw new CustomError("Problem not found", 404);
  }

  const submissions = await Submission.find({
    user: userId,
    problem: problem._id,
  })
    .select(
      "user problem code language status output error createdAt executionTime memory"
    )
    .sort({ createdAt: -1 });

  return {
    problemId: problem._id,
    submissions,
  };
   }
  


  async getSolvedProblemsByLanguage(userId: string) {
    const results = await Submission.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          status: "Accepted",
        },
      },
      {
        $group: {
          _id: { language: "$language", problem: "$problem" },
        },
      },
      {
        $group: {
          _id: "$_id.language",
          problemsSolved: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          language: "$_id",
          problemsSolved: 1,
        },
      },
    ]);

    return results;
  }


  async getRecentAccepted(userId: string, limit = 10) {
    const recents = await Submission.find({
      user: new mongoose.Types.ObjectId(userId),
      status: "Accepted",
    })
      .populate("problem", "title slug difficulty")
      .sort({ createdAt: -1 })
      .limit(limit);

    return recents.map((submission) => ({
      title: (submission.problem as any)?.title,
      slug: (submission.problem as any)?.slug,
      difficulty: (submission.problem as any)?.difficulty,
      solvedAt: submission.createdAt,
    }));
  }


  async getUserSubmissionActivity(userId: string, days = 90) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = await Submission.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    return results;
  }
}

export default new SubmissionService();
