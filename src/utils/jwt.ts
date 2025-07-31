import jwt, { JwtPayload } from 'jsonwebtoken';
import CustomError from './custom.error';
import config from '../config';

// Use the keys from environment (loaded via Config)
const PRIVATE_KEY = config.JWT_PRIVATE_KEY;
const PUBLIC_KEY = config.JWT_PUBLIC_KEY;

// Sign Access Token (15 minutes expiry)
export const signAccessToken = (userId: string): string => {
    return jwt.sign({ userId }, PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: '15m',
    });
};

// Sign Refresh Token (7 days expiry)
export const signRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: '7d',
    });
};

// Verify Access Token
export const verifyAccessToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, PUBLIC_KEY, {
            algorithms: ['RS256'],
        }) as JwtPayload;
    } catch (err: any) {
        throw new CustomError('Access Token Invalid or Expired', 401);
    }
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, PUBLIC_KEY, {
            algorithms: ['RS256'],
        }) as JwtPayload;
    } catch (err: any) {
        throw new CustomError('Refresh Token Invalid or Expired', 401);
    }
};
