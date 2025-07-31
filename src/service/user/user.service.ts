import mongoose from 'mongoose';
import User, { Gender, IUser, UserRole } from '../../models/user/user.schema';
import CustomError from '../../utils/custom.error';
import { sanitizeUser } from '../../utils/sanitize.user';

interface UserData {
  name?: string;
  email?: string;
  role?: UserRole;
  gender?: Gender;
  location?: string;
  birthday?: string;
  summary?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  work?: string;
  education?: string;
  skills?: string[];
}


class UserService {

async updateProfile(userId: string, updateData: Partial<IUser>): Promise<Partial<IUser>> {
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  // ✅ Gender validation (PascalCase)
  if (
    updateData.gender &&
    !["male", "female", "other"].includes(updateData.gender)
  ) {
    throw new CustomError("Invalid gender value. Allowed: Male, Female, Other", 400);
  }

  // ✅ Apply only allowed fields
  const allowedFields: (keyof IUser)[] = [
    "name", "email", "gender", "location", "birthday", "summary",
    "website", "github", "linkedin", "twitter", "work", "education", "skills"
  ];

  allowedFields.forEach((key) => {
    if (updateData[key] !== undefined) {
      (user as any)[key] = updateData[key];
    }
  });

  await user.save();

  return sanitizeUser(user);
}



  // Fetch all users
  async getAllUsers(): Promise<IUser[]> {
    return await User.find().select("-password");
  }

  // Fetch a single user by ID
  async getUserById(id: string): Promise<IUser> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid user ID", 400);
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    return user;
  }

  // Update user (admin can change any field except password here)
  async updateUser(id: string, updates: Partial<UserData>): Promise<IUser> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid user ID", 400);
    }

    const allowedUpdates: Partial<UserData> = { ...updates };

    const updatedUser = await User.findByIdAndUpdate(id, allowedUpdates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      throw new CustomError("User not found", 404);
    }

    return updatedUser;
  }

  // Delete a user by ID
  async deleteUser(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid user ID", 400);
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      throw new CustomError("User not found", 404);
    }
  }

  //public
   async getUserNameById(userId: string): Promise<string> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new CustomError('Invalid user ID format', 400);
    }

    const user = await User.findById(userId).select('name');

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    return user.name;
  }
}

export default new UserService();
