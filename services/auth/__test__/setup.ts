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

    return [response.body.token];
};
