import express from 'express';
import { createReview, deleteReview, getAllReviews, getReviewById } from '../../controllers/course/review.controller';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { authorizeRoles } from '../../middleware/authorize.role';
import { createReviewValidation } from '../../validations/course/review/create.review.validation';
import { validateRequest } from '../../middleware/validation.middleware';
import { deleteReviewValidation } from '../../validations/course/review/delete.review.validation';

const reviewRoutes = express.Router();

// Public
reviewRoutes.get('/', getAllReviews);
reviewRoutes.get('/:id', getReviewById);

// Protected
reviewRoutes.post(
  '/',
  isAuthenticate,
  authorizeRoles('user', 'admin'),
  createReviewValidation,
  validateRequest,
  createReview
);

reviewRoutes.delete(
  '/:id',
  isAuthenticate,
  authorizeRoles('admin'),
  deleteReviewValidation,
  validateRequest,
  deleteReview
);

export default reviewRoutes;
