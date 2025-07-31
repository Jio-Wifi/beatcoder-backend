import { Request, Response, NextFunction, RequestHandler } from 'express';
import CustomError from '../utils/custom.error';
import { IUser } from '../models/user/user.schema';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
export const authorizeRoles = (...allowedRoles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;

    const userRole = user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(
        new CustomError('Access denied: insufficient permissions', 403)
      );
    }

    next();
  };
};
