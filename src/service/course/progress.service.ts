import mongoose from 'mongoose';
import Progress, { IProgress } from '../../models/course/progress.schema';
import CustomError from '../../utils/custom.error';

interface ProgressData {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  completedLessons: mongoose.Types.ObjectId[];
}

class ProgressService {
  async createProgress(data: ProgressData): Promise<IProgress> {
    const exists = await Progress.findOne({ user: data.user, course: data.course });
    if (exists) {
      throw new CustomError('Progress already exists for this user and course', 409);
    }

    return await Progress.create(data);
  }

  async getAllProgress(): Promise<IProgress[]> {
    return await Progress.find()
      .populate({
        path: 'user',
        select: 'name email role', // only essential fields
      })
      .populate({
        path: 'course',
        select: 'title description', // only essential fields
      })
      .populate({
        path: 'completedLessons',
        select: 'title order videoDuration', // lesson details
      });
  }

  async getProgressById(id: string): Promise<IProgress> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid progress ID', 400);
    }

    const progress = await Progress.findById(id)
      .populate({
        path: 'user',
        select: 'name email role',
      })
      .populate({
        path: 'course',
        select: 'title description',
      })
      .populate({
        path: 'completedLessons',
        select: 'title order videoDuration',
      });

    if (!progress) throw new CustomError('Progress not found', 404);
    return progress;
  }

  async updateProgress(id: string, updates: Partial<ProgressData>): Promise<IProgress> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid progress ID', 400);
    }

    const updated = await Progress.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate({
        path: 'user',
        select: 'name email role',
      })
      .populate({
        path: 'course',
        select: 'title description',
      })
      .populate({
        path: 'completedLessons',
        select: 'title order videoDuration',
      });

    if (!updated) throw new CustomError('Progress not found', 404);
    return updated;
  }

  async deleteProgress(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid progress ID', 400);
    }

    const deleted = await Progress.findByIdAndDelete(id);
    if (!deleted) throw new CustomError('Progress not found', 404);
  }
}

export default new ProgressService();
