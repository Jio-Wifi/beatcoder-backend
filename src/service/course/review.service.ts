import mongoose from 'mongoose';
import Review, { IReview } from '../../models/course/review.schema';
import CustomError from '../../utils/custom.error';

interface ReviewData {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

class ReviewService {
  async createReview(data: ReviewData): Promise<IReview> {
    const existing = await Review.findOne({ user: data.user, course: data.course });

    if (existing) {
      throw new CustomError('You have already reviewed this course', 409);
    }

    return await Review.create(data);
  }

  async getAllReviews(): Promise<IReview[]> {
    return await Review.find().populate('user').populate('course');
  }

  async getReviewById(id: string): Promise<IReview> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid review ID', 400);
    }

    const review = await Review.findById(id).populate('user').populate('course');
    if (!review) {
      throw new CustomError('Review not found', 404);
    }

    return review;
  }

  async deleteReview(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError('Invalid review ID', 400);
    }

    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      throw new CustomError('Review not found', 404);
    }
  }
}

export default new ReviewService();
