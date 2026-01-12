import mongoose from 'mongoose';
import { app } from './app';
import dotenv from 'dotenv';
dotenv.config();

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI must be defined');
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDb');
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000');
    });
};

start();
