import { Request,Response,NextFunction } from "express";
import CustomError from "../utils/custom.error";
import { verifyRefreshToken } from "../utils/jwt";
import User from "../models/user/user.schema";

export const isAuthenticate =async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
   return next( new CustomError('refresh token is required', 400));
  }

  try {
    const payload = verifyRefreshToken(token); 
     const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    // Attach user and token info to res.locals or req
     (req as any).user = user;

    res.locals.refreshSession = { token, payload }; 
    next();
  } catch (error) {
    next(error);
  }
};
