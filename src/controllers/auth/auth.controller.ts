import { Request, Response } from 'express';
import catchAsync from '../../utils/catch.async';
import AuthService from '../../service/auth/auth.service';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { clearCookies, setAuthCookies } from '../../utils/cookies';
import CustomError from '../../utils/custom.error';
import User from '../../models/user/user.schema';
import { sanitizeUser } from '../../utils/sanitize.user';
import redisClient from '../../config/redis';
import CommunityStatsService from '../../service/code/community.stats.service';
import mongoose from 'mongoose';


export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const newUser = await AuthService.register(name, email, password);

  await CommunityStatsService.createStats({
    user: newUser._id as mongoose.Types.ObjectId,
  });

  const accessToken = signAccessToken(newUser._id as string);
  const refreshToken = signRefreshToken(newUser._id as string);

  setAuthCookies(res, accessToken, refreshToken);

  return res.status(201).json({
    user: newUser,
    message: 'User Register Successfully...',
  });
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    throw new CustomError('Refresh Token Required!', 400);
  }

  try {
    const decode = verifyRefreshToken(refreshToken);
    const accessToken = signAccessToken(decode.userId);
    const user = await User.findById(decode.userId);

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const safeUser = sanitizeUser(user);

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: 'Token Refreshed',
      user: safeUser,
    });
  } catch (error) {
    throw new CustomError('Refresh Token Invalid!', 403);
  }
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await AuthService.login(
    email,
    password
  );

  setAuthCookies(res, accessToken, refreshToken);

  return res.status(200).json({
    message: 'Login Successfully...',
    user,
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const { token, payload } = res.locals.refreshSession;

  if (!payload?.exp) {
    throw new CustomError('Invalid refresh token', 400);
  }

  await redisClient.set(`blocked:token:${token}`, 'true');
  await redisClient.expireAt(`blocked:token:${token}`, payload.exp);

  clearCookies(res);

  return res.status(200).json({ message: 'Logged out successfully' });
});


export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const message = await AuthService.forgotPassword(email);

  return res.status(200).json({ message });
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new CustomError('Token and new password are required', 400);
  }

  await AuthService.changePassword(token, newPassword);

  return res.status(200).json({ message: 'Password changed successfully' });
});
