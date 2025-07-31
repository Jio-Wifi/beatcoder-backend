import Submission from '../../models/code/submission.schema';
import Problem from '../../models/code/problem.schema';

class UserStatsService {
  async getUserStats(userId: string) {
    // Get all submissions for user
    const submissions = await Submission.find({ user: userId }).populate('problem', 'difficulty');

    // Total problems in DB
    const totalProblems = await Problem.countDocuments();

    // Track solved, attempting, by difficulty
    const solvedProblems = new Set<string>();
    const attemptingProblems = new Set<string>();

    let totalAccepted = 0;
    let totalSubmissions = submissions.length;

    const difficultySolved: Record<string, number> = { easy: 0, medium: 0, hard: 0 };
    const difficultyTotal: Record<string, number> = {
      easy: await Problem.countDocuments({ difficulty: 'easy' }),
      medium: await Problem.countDocuments({ difficulty: 'medium' }),
      hard: await Problem.countDocuments({ difficulty: 'hard' }),
    };

    submissions.forEach((sub) => {
      const problemId = sub.problem?._id?.toString();
      const difficulty = (sub.problem as any)?.difficulty;

      if (sub.status === 'Accepted') {
        totalAccepted++;
        if (!solvedProblems.has(problemId)) {
          solvedProblems.add(problemId);
          if (difficulty) difficultySolved[difficulty]++;
        }
      } else {
        if (!solvedProblems.has(problemId)) {
          attemptingProblems.add(problemId);
        }
      }
    });

    const solvedCount = solvedProblems.size;
    const acceptanceRate = totalSubmissions > 0 
      ? (totalAccepted / totalSubmissions) * 100 
      : 0;

    return {
      solved: solvedCount,
      totalProblems,
      acceptanceRate,
      attempting: attemptingProblems.size,
      totalSubmissions,
      difficulty: {
        easy: { solved: difficultySolved.easy, total: difficultyTotal.easy },
        medium: { solved: difficultySolved.medium, total: difficultyTotal.medium },
        hard: { solved: difficultySolved.hard, total: difficultyTotal.hard },
      }
    };
  }
}

export default new UserStatsService();
