import { Request, Response, NextFunction } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import CustomError from '../utils/custom.error';

// validation middleware
export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new CustomError(errors.array()[0].msg, 400));
    }
    next();
};
