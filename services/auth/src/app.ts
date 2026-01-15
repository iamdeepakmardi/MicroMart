import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@micromart/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);

app.get('/api/users/ping', (req, res) => {
    res.send('pong');
});

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
