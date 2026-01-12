import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@micromart/common';

import { createProductRouter } from './routes/create-product';
import { showProductRouter } from './routes/show-product';
import { indexProductRouter } from './routes/index-products';
import { updateProductRouter } from './routes/update-product';
import { createCategoryRouter } from './routes/create-category';
import { indexCategoryRouter } from './routes/index-categories';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test',
    })
);
app.use(currentUser);

app.use(createProductRouter);
app.use(showProductRouter);
app.use(indexProductRouter);
app.use(updateProductRouter);
app.use(createCategoryRouter);
app.use(indexCategoryRouter);

app.get('/api/catalog/ping', (req, res) => {
    res.send('pong');
});

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
