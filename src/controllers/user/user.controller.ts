import { Request, Response } from "express";
import UserService from "../../service/user/user.service";
import catchAsync from "../../utils/catch.async";

export const getProfile = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;

    res.status(200).json({
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  const {
    name,
    email,
    gender,
    location,
    birthday,
    summary,
    website,
    github,
    linkedin,
    twitter,
    work,
    education,
    skills, // assuming array
  } = req.body;

  const updateData = {
    name,
    email,
    gender,
    location,
    birthday,
    summary,
    website,
    github,
    linkedin,
    twitter,
    work,
    education,
    skills,
  };

  const updatedUser = await UserService.updateProfile(user._id, updateData);

  res.status(200).json({
    message: 'Profile updated successfully',
    user: updatedUser,
  });
});



export const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await UserService.getAllUsers();
  res.status(200).json({ users });
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.getUserById(req.params.id);
  res.status(200).json({ user });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const updatedUser = await UserService.updateUser(req.params.id, req.body);
  res.status(200).json({ message: "User updated successfully", user: updatedUser });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;


  await UserService.deleteUser(user._id);

  // Clear tokens
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({
    message: 'User deleted successfully',
  });
});

export const getUserNameById = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const name = await UserService.getUserNameById(userId);
  return res.status(200).json({ name });
});