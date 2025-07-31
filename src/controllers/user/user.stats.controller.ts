import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import UserStatsService from '../../service/user/user.stats.service';

export const getMyStats = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  const stats = await UserStatsService.getUserStats(user._id);

  res.status(200).json({ stats });
});
