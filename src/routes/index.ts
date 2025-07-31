import express from 'express';
import authRoutes from './auth/auth.route';
import userRoutes from './user/user.route';
import problemRoutes from './code/problem.route';
import testCaseRoutes from './code/testcase.route';
import submissionRoutes from './code/submission.route';
import courseRoutes from './course/course.route';
import lessonRoutes from './course/lesson.route';
import categoryRoutes from './course/category.route';
// import enrollmentRoutes from './course/enrollement.route';
import reviewRoutes from './course/review.route';
import progressRoutes from './course/progress.route';
import quizRoutes from './course/quiz.route';
import certificateRoutes from './course/certificate.route';
import instructorRoutes from './course/instructor.route';
import analyticsRoutes from './analyatics/analyatic.route';

import subscriptionRoutes from './subscription/subscription.route';
import communityStatsRoutes from './code/community.stats.route';
import userStatsRoutes from './user/user.stats.routes';
import skillStatsRoutes from './code/skill.stats.routes';
import userActivityRoutes from './user/user.activity.routes';
import compilerRoutes from './compiler/code.execution.route';

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/user', userRoutes);
routes.use('/user', userStatsRoutes);
routes.use('/user', userActivityRoutes);


// code 
routes.use('/problems', problemRoutes);
routes.use('/testcase', testCaseRoutes);
routes.use('/submission', submissionRoutes);
routes.use('/community', communityStatsRoutes);
routes.use('/skill', skillStatsRoutes);

// compiler
routes.use('/compiler',compilerRoutes)

// course
routes.use('/course',courseRoutes)
routes.use('/lesson',lessonRoutes)
routes.use('/category',categoryRoutes)
// routes.use('/enrollement',enrollmentRoutes)
routes.use('/review',reviewRoutes)
routes.use('/progress',progressRoutes)
routes.use('/quiz',quizRoutes)
routes.use('/certificate',certificateRoutes)
routes.use('/instructor',instructorRoutes)

routes.use('/analytics',analyticsRoutes)

routes.use('/subscription',subscriptionRoutes)




export default routes;
