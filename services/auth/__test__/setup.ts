import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../src/app';
import request from 'supertest';

declare global {
    var signin: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasdf';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    const collections = await mongoose.connection.db?.collections();
    if (collections) {
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password,
            username: 'test',
            firstName: 'fn',
            lastName: 'ln'
        })
        .expect(201);

    // For Cookie-based auth
    // const cookie = response.get('Set-Cookie');
    // return cookie;

    // For token based auth (legacy)
    // We return array to match cookie signature usually used in this pattern,
    // OR we just return the token string if we want.
    // But since legacy used 'token' in BODY, we don't need a global helper that sets cookies?
    // The helper usually simulates a logged in user.
    // If our middleware checks Header, we need to return a Header value.
    // Let's assume we want the token.
    return [response.body.token];
};
