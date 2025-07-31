import Submission from '../../models/code/submission.schema';
import mongoose from 'mongoose';

class SkillStatsService {
  async getUserSkills(userId: string) {
    const solved = await Submission.find({ 
      user: new mongoose.Types.ObjectId(userId),
      status: 'Accepted'
    }).populate('problem', 'subject difficulty');

    const counts: Record<string, number> = {};

    solved.forEach((sub) => {
      const subject = (sub.problem as any)?.subject;
      if (subject) {
        counts[subject] = (counts[subject] || 0) + 1;
      }
    });

    // Group by tiers (adjust based on your categories)
    const skills = {
      Advanced: [] as { tag: string; count: number }[],
      Intermediate: [] as { tag: string; count: number }[],
      Fundamental: [] as { tag: string; count: number }[],
    };

    for (const [subject, count] of Object.entries(counts)) {
      if (['Dynamic Programming', 'Graphs', 'Trie'].includes(subject)) {
        skills.Advanced.push({ tag: subject, count });
      } else if (['Hashing', 'Heap', 'Sorting & Searching'].includes(subject)) {
        skills.Intermediate.push({ tag: subject, count });
      } else {
        skills.Fundamental.push({ tag: subject, count });
      }
    }

    return skills;
  }
}

export default new SkillStatsService();
