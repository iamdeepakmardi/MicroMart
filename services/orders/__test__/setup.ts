import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    var signin: () => string[];
}

jest.setTimeout(600000); // 10 minutes

beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';
    // Using Docker MongoDB (separate DB) to avoid binary download issues
    const mongoUri = 'mongodb://localhost:27017/orders_test';
    await mongoose.connect(mongoUri, {});
    console.log('Mongoose connected to local MongoDB');
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
    await mongoose.connection.close();
});

global.signin = () => {
    // Build a JWT payload.  { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
        username: 'testu'
    };

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Return it (Auth middleware looks for Bearer token in Header usually)
    return [token];
};
