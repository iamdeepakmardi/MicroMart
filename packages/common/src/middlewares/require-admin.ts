import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }

    if (!req.currentUser.isAdmin) {
        throw new NotAuthorizedError();
    }

    next();
};
