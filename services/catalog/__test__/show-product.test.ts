import request from 'supertest';
import { app } from '../src/app';
import { Category } from '../src/models/category';
import { Product } from '../src/models/product';
import mongoose from 'mongoose';

it('returns a 404 if the product is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/products/${id}`)
        .send()
        .expect(404);
});

it('returns the product if the product is found', async () => {
    const category = Category.build({ name: 'Cat', description: 'Desc' });
    await category.save();

    const product = Product.build({
        name: 'Prod',
        price: 10,
        inventory: 10,
        description: 'Desc',
        category: category.id
    });
    await product.save();

    const response = await request(app)
        .get(`/api/products/${product.id}`)
        .send()
        .expect(200);

    expect(response.body.name).toEqual('Prod');
    expect(response.body.price).toEqual(10);
});
