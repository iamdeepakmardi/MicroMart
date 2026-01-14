import request from 'supertest';
import { app } from '../src/app';
import { Category } from '../src/models/category';
import mongoose from 'mongoose';

const createCategory = async () => {
    const category = Category.build({
        name: 'Electronics',
        description: 'Test Desc'
    });
    await category.save();
    return category;
}

it('has a route handler listening to /api/products for post requests', async () => {
    const response = await request(app)
        .post('/api/products')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
    await request(app)
        .post('/api/products')
        .send({})
        .expect(401);
});

it('can only be accessed if the user is an admin', async () => {
    // signin(false) = regular user
    const token = global.signin(false)[0];

    await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(401);
});

it('returns a status other than 401 if the user is signed in as admin', async () => {
    const token = global.signin(true)[0];

    const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
    const token = global.signin(true)[0];
    const category = await createCategory();

    await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: '',
            price: 10,
            inventory: 10,
            description: 'desc',
            category: category.id
        })
        .expect(400); // 400 for validation error? Common library uses 400 for BadRequestError
});

it('creates a product with valid inputs', async () => {
    const token = global.signin(true)[0];
    const category = await createCategory();

    // Test adding product
    const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Valid Product',
            price: 20,
            inventory: 10,
            description: 'desc',
            category: category.id
        })
        .expect(201);

    expect(response.body.name).toEqual('Valid Product');
});
