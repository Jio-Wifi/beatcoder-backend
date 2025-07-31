import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/custom.error';

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', err.message);

    const statusCode = err instanceof CustomError ? err.statusCode : 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};

export default errorHandler;
