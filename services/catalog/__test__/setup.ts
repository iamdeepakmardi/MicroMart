import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    var signin: (isAdmin?: boolean) => string[];
}

jest.setTimeout(600000); // 10 minutes

beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';

    // Using Docker MongoDB (separate DB) to avoid binary download issues
    const mongoUri = 'mongodb://localhost:27017/catalog_test';

    // mongoose-update-if-current / native OCC needs family:4 on some docker setups, 
    // but localhost usually is fine.
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

global.signin = (isAdmin = false) => {
    // Build a JWT payload.  { id, email, isAdmin }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
        username: 'testu',
        isAdmin
    };

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Return it (Auth middleware looks for Bearer token in Header usually)
    // BUT the common currentUser currently looks for:
    // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) ... 

    // So we return the token string, and tests will attach it.
    // Wait, the Auth service setup returns string[]. Let's keep consistency if we copied helper logic.
    // The tests use .set('Authorization', `Bearer ${token}`)

    return [token];
};
