import { Response } from 'express';
import config from '../config';

const isProd = config.NODE_ENV === 'production';

export const setAuthCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string
) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export const clearCookies = (res: Response) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
    });
};
