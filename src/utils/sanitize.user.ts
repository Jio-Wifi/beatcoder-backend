import { IUser } from "../models/user/user.schema";


export function sanitizeUser(user: IUser): Partial<IUser> {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.comparePassword;
  return userObj;
}
