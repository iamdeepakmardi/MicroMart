import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/product';
import { Category } from './models/category';

dotenv.config();

const seed = async () => {
    if (!process.env.MONGODB_URI) {
        console.warn("MONGODB_URI not defined, using default");
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/catalog', {
            family: 4,
        });
        console.log('Connected to MongoDb');

        // Clear existing data
        await Product.deleteMany({});
        await Category.deleteMany({});
        console.log('Cleared existing data');

        // Create Categories
        const electronics = Category.build({ name: 'Electronics', description: 'Gadgets and devices' });
        await electronics.save();

        const clothing = Category.build({ name: 'Clothing', description: 'Apparel and fashion' });
        await clothing.save();

        const home = Category.build({ name: 'Home & Kitchen', description: 'Decor, furniture, and appliances' });
        await home.save();

        // Create Products
        const p1 = Product.build({
            name: 'Smartphone X',
            description: 'Latest model with 5G',
            price: 999,
            category: electronics._id.toString(),
            inventory: 50
        });
        await p1.save();

        const p2 = Product.build({
            name: 'Laptop Pro',
            description: 'High performance laptop',
            price: 1999,
            category: electronics._id.toString(),
            inventory: 30
        });
        await p2.save();

        const p3 = Product.build({
            name: 'Cotton T-Shirt',
            description: '100% Cotton, White',
            price: 25,
            category: clothing._id.toString(),
            inventory: 100
        });
        await p3.save();

        const p4 = Product.build({
            name: 'Coffee Maker',
            description: 'Programmable drip coffee maker',
            price: 75,
            category: home._id.toString(),
            inventory: 20
        });
        await p4.save();

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
