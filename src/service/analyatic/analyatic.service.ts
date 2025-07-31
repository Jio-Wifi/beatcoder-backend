import Course from "../../models/course/course.schema";
import Lesson from "../../models/course/lesson.schema";
import Review from "../../models/course/review.schema";
import Progress from "../../models/course/progress.schema";
import Category from "../../models/course/category.schema";
import Quiz from "../../models/course/quiz.schema";
import Certificate from "../../models/course/certificate.schema";
import Instructor from "../../models/course/instructor.schema";
import User from "../../models/user/user.schema";
import CustomError from "../../utils/custom.error";
import UserSubscription from "../../models/subscription/user.subscription.schema";

export interface OverviewStats {
  totalCourses: number;
  totalLessons: number;
  totalReviews: number;
  totalProgress: number;
  totalCategories: number;
  totalQuizzes: number;
  totalCertificates: number;
  totalInstructors: number;
  totalUsers: number;
  totalUserSubscriptions: number;
}

export interface MonthlyData {
  month: number; // 1–12
  total: number;
}

class AnalyticsService {
  /**
   * Get total counts for dashboard cards and stats
   */
  async getOverview(): Promise<OverviewStats> {
    try {
      const [
        totalCourses,
        totalLessons,
        totalReviews,
        totalProgress,
        totalCategories,
        totalQuizzes,
        totalCertificates,
        totalInstructors,
        totalUsers,
        totalUserSubscriptions
      ] = await Promise.all([
        Course.countDocuments(),
        Lesson.countDocuments(),
        Review.countDocuments(),
        Progress.countDocuments(),
        Category.countDocuments(),
        Quiz.countDocuments(),
        Certificate.countDocuments(),
        Instructor.countDocuments(),
        User.countDocuments(),
        UserSubscription.countDocuments({ status: "active" }),
      ]);

      return {
        totalCourses,
        totalLessons,
        totalReviews,
        totalProgress,
        totalCategories,
        totalQuizzes,
        totalCertificates,
        totalInstructors,
        totalUsers,
        totalUserSubscriptions,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch analytics data";
      throw new CustomError(message, 500);
    }
  }

  /**
   * Get monthly active subscriptions count (for line/bar charts)
   */
  async getMonthlySubscriptions(year: number): Promise<MonthlyData[]> {
    try {
      const monthlySubscriptions: { _id: number; total: number }[] =
        await UserSubscription.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`),
              },
            },
          },
          {
            $group: {
              _id: { $month: "$createdAt" },
              total: { $sum: 1 },
            },
          },
          { $sort: { "_id": 1 } },
        ]);

      return monthlySubscriptions.map((month) => ({
        month: month._id,
        total: month.total,
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch monthly subscriptions";
      throw new CustomError(message, 500);
    }
  }

  /**
   * Simulated monthly revenue (temporary, until real Transactions are implemented)
   */
  async getMonthlyRevenue(year: number): Promise<MonthlyData[]> {
    try {
      const subscriptions = await this.getMonthlySubscriptions(year);

      // Assume each subscription generates $10 for demo purposes
      return subscriptions.map(({ month, total }) => ({
        month,
        total: total * 10,
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate revenue data";
      throw new CustomError(message, 500);
    }
  }
}

export default new AnalyticsService();
