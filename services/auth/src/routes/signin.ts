import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@micromart/common';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post(
    '/api/users/signin',
    [
        body('username').notEmpty().withMessage('Username must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password must be supplied')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }

        const passwordsMatch = await Password.compare(
            existingUser.password,
            password
        );
        if (!passwordsMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
                username: existingUser.username,
                isAdmin: existingUser.isAdmin
            },
            process.env.JWT_KEY!
        );

        res.status(200).send({ user: existingUser, token: userJwt });
    }
);

export { router as signinRouter };
