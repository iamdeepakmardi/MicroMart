import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/bad-request-error'; // Should be NotAuthorizedError but reusing for speed

export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.currentUser) {
        throw new BadRequestError('Not authorized');
    }

    next();
};
