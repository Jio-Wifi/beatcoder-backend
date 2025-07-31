import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import SkillStatsService from '../../service/code/skill.stats.service';

export const getMySkills = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const skills = await SkillStatsService.getUserSkills(user._id);

  res.status(200).json({ skills });
});
