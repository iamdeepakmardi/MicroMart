import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Simplified for now, just throwing first error or generic
        throw new BadRequestError(errors.array()[0].msg);
    }

    next();
};
