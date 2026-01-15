import request from 'supertest';
import { app } from '../src/app';

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
            username: 'testu'
        })
        .expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'alskdflaskjfd',
            password: 'password',
            username: 'testu'
        })
        .expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
            username: 'testu'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
            username: 'testu'
        })
        .expect(400);
});
