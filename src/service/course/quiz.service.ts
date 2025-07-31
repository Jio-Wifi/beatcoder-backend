import Quiz, { IQuiz } from '../../models/course/quiz.schema';
import CustomError from '../../utils/custom.error';
import mongoose from 'mongoose';

interface QuizInput {
  course: mongoose.Types.ObjectId;
  question: string;
  options: string[];
  correctAnswer: string;
}

class QuizService {
  async createQuiz(data: QuizInput): Promise<IQuiz> {
    return await Quiz.create(data);
  }

  async getAllQuizzes(): Promise<IQuiz[]> {
    return await Quiz.find().populate('course');
  }

  async getQuizById(id: string): Promise<IQuiz> {
    const quiz = await Quiz.findById(id).populate('course');
    if (!quiz) throw new CustomError('Quiz not found', 404);
    return quiz;
  }

  async updateQuiz(id: string, updates: Partial<QuizInput>): Promise<IQuiz> {
    const updated = await Quiz.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('course');

    if (!updated) throw new CustomError('Quiz not found', 404);
    return updated;
  }

  async deleteQuiz(id: string): Promise<void> {
    const deleted = await Quiz.findByIdAndDelete(id);
    if (!deleted) throw new CustomError('Quiz not found', 404);
  }
}

export default new QuizService();
