import request from 'supertest';
import { app } from '../src/app';

it('has a route handler listening to /api/categories for post requests', async () => {
    const response = await request(app)
        .post('/api/categories')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('cannot be accessed by non-admins', async () => {
    const token = global.signin(false)[0];

    await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test' })
        .expect(401);
});

it('creates a category with valid inputs', async () => {
    const token = global.signin(true)[0];

    await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Books',
            description: 'All kinds of books'
        })
        .expect(201);
});
