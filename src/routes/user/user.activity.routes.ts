import express from 'express';
import { isAuthenticate } from '../../middleware/is.authenticate';
import { getMyActivity } from '../../controllers/user/user.activity.controller';

const userActivityRoutes = express.Router();

// User's last-year submission activity (for streak graph)
userActivityRoutes.get('/activity/me', isAuthenticate, getMyActivity);

export default userActivityRoutes;


