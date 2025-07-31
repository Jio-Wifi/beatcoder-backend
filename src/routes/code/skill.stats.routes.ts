import express from 'express';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { getMySkills } from '../../controllers/code/skill.stats.controller';

const skillStatsRoutes = express.Router();

// Fetch logged-in user's skills breakdown
skillStatsRoutes.get('/me', isAuthenticate, getMySkills);

export default skillStatsRoutes;
