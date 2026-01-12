import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user';

dotenv.config();

const seed = async () => {
    if (!process.env.MONGODB_URI) {
        console.warn("MONGODB_URI not defined, using default");
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth', {
            family: 4,
        });
        console.log('Connected to MongoDb');

        const adminEmail = 'admin@micromart.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists');
        } else {
            const admin = User.build({
                email: adminEmail,
                password: 'password', // TODO: Change checking env var
                username: 'admin',
                firstName: 'Admin',
                lastName: 'User'
            });
            // We need to set isAdmin manually since build() only expects UserAttrs
            admin.set({ isAdmin: true });
            await admin.save();
            console.log('Admin user created');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
