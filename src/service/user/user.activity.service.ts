import Submission from '../../models/code/submission.schema';
import mongoose from 'mongoose';
import dayjs from 'dayjs';

class UserActivityService {
  async getUserActivity(userId: string) {
    const now = dayjs();
    const oneYearAgo = now.subtract(12, 'month').toDate();

    // Fetch all submissions in the last year
    const submissions = await Submission.find({
      user: new mongoose.Types.ObjectId(userId),
      createdAt: { $gte: oneYearAgo },
    }).select('createdAt');

    // Total submissions
    const totalSubmissions = submissions.length;

    // Group by day for streaks & active days
    const dayMap = new Map<string, number>(); // YYYY-MM-DD -> count
    submissions.forEach((sub) => {
      const day = dayjs(sub.createdAt).format('YYYY-MM-DD');
      dayMap.set(day, (dayMap.get(day) || 0) + 1);
    });

    const activeDays = dayMap.size;

    // Calculate max streak (longest consecutive active days)
    const sortedDays = Array.from(dayMap.keys()).sort();
    let maxStreak = 0;
    let currentStreak = 0;
    let prevDay: string | null = null;

    sortedDays.forEach((day) => {
      if (!prevDay) {
        currentStreak = 1;
      } else {
        const prev = dayjs(prevDay);
        const curr = dayjs(day);
        if (curr.diff(prev, 'day') === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, currentStreak);
      prevDay = day;
    });

    // Group by month for the last 12 months (calendar bars)
    const months: Record<string, number> = {};
    submissions.forEach((sub) => {
      const monthKey = dayjs(sub.createdAt).format('MMM YYYY'); // e.g., Aug 2025
      months[monthKey] = (months[monthKey] || 0) + 1;
    });

    // Ensure all 12 months exist in result even if 0 submissions
    for (let i = 0; i < 12; i++) {
      const monthKey = now.subtract(i, 'month').format('MMM YYYY');
      if (!months[monthKey]) months[monthKey] = 0;
    }

    return {
      totalSubmissions,
      activeDays,
      maxStreak,
      months: Object.entries(months)
        .sort(
          ([a], [b]) => dayjs(a, 'MMM YYYY').unix() - dayjs(b, 'MMM YYYY').unix()
        )
        .map(([month, count]) => ({ month, count })),
    };
  }
}

export default new UserActivityService();


