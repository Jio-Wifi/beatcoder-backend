import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import UserActivityService from '../../service/user/user.activity.service';

export const getMyActivity = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const activity = await UserActivityService.getUserActivity(user._id);

  res.status(200).json({ activity });
});
