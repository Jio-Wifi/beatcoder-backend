// src/types/express/index.d.ts
import { IUser } from '../../models/user/user.schema';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // ✅ Adds user to Request type
    }
    interface Response {
      locals: {
        refreshSession?: {
          token: string;
          payload: JwtPayload;
        };
      };
    }
  }
}
