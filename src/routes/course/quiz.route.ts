import express from 'express';
import { authorizeRoles } from '../../middleware/authorize.role';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { createQuizValidation } from '../../validations/course/quiz/create.quiz.validation';
import { validateRequest } from '../../middleware/validation.middleware';
import { createQuiz, deleteQuiz, getAllQuizzes, getQuizById, updateQuiz } from '../../controllers/course/quiz.controller';
import { checkSubscription } from '../../middleware/check.subscription';

const quizRoutes = express.Router();

quizRoutes.post(
  '/',
  isAuthenticate,
  authorizeRoles('admin'),
  createQuizValidation,
  validateRequest,
  createQuiz
);

quizRoutes.put('/:id', isAuthenticate, authorizeRoles('admin'), updateQuiz);
quizRoutes.delete('/:id', isAuthenticate, authorizeRoles('admin'), deleteQuiz);
quizRoutes.get('/', getAllQuizzes);

// Premimum
quizRoutes.get('/:id',isAuthenticate,checkSubscription, getQuizById);

export default quizRoutes;
