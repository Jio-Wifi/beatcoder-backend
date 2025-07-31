import express from 'express';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { getMyStats } from '../../controllers/user/user.stats.controller';

const userStatsRoutes = express.Router();

// Get logged-in user's stats (solved, acceptance, etc.)
userStatsRoutes.get('/activity/stats/me', isAuthenticate, getMyStats);

export default userStatsRoutes;
