import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@micromart/common';
import { User } from '../models/user';

const router = express.Router();

router.post(
    '/api/users/signup',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters'),
        body('username').notEmpty().withMessage('Username is required')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password, username, firstName, lastName } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new BadRequestError('Email in use');
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            throw new BadRequestError('Username in use');
        }

        const user = User.build({ email, password, username, firstName, lastName });
        await user.save();

        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username,
                isAdmin: user.isAdmin
            },
            process.env.JWT_KEY!
        );

        // TODO: Store it on session object (if using cookies) OR return it
        // req.session = { jwt: userJwt };

        res.status(201).send({ user, token: userJwt });
    }
);

export { router as signupRouter };
