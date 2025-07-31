import { IUser } from "../models/user/user.schema";

/**
 * Removes sensitive fields like password and comparePassword
 * before sending the user object to frontend.
 */
export function sanitizeUser(user: IUser): Partial<IUser> {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.comparePassword;
  return userObj;
}
