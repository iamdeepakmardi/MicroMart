import request from 'supertest';
import { app } from '../src/app';
import { Category } from '../src/models/category';
import { Product } from '../src/models/product';
import mongoose from 'mongoose';

const createCategory = async () => {
    const category = Category.build({
        name: 'Electronics',
        description: 'Test Desc'
    });
    await category.save();
    return category;
}

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const token = global.signin(true)[0];

    await request(app)
        .put(`/api/products/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'valid',
            price: 20,
            inventory: 10,
            description: 'desc',
            category: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/products/${id}`)
        .send({
            name: 'valid',
            price: 20
        })
        .expect(401);
});

it('returns a 401 if the user is not an admin', async () => {
    const token = global.signin(false)[0];
    const category = await createCategory();
    const product = Product.build({
        name: 'Prod', price: 10, inventory: 10, description: 'Desc', category: category.id
    });
    await product.save();

    await request(app)
        .put(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'new name',
            price: 100
        })
        .expect(401);
});


it('updates the product provided valid inputs', async () => {
    const token = global.signin(true)[0];
    const category = await createCategory();
    const product = Product.build({
        name: 'Prod', price: 10, inventory: 10, description: 'Desc', category: category.id
    });
    await product.save();

    await request(app)
        .put(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'new name',
            price: 100,
            inventory: 10,
            description: 'Desc',
            category: category.id
        })
        .expect(200);

    const productFetch = await Product.findById(product.id);
    expect(productFetch!.name).toEqual('new name');
    expect(productFetch!.price).toEqual(100);
});

it('enforces optimistic concurrency control', async () => {
    const category = await createCategory();
    const product = Product.build({
        name: 'Prod', price: 10, inventory: 10, description: 'Desc', category: category.id
    });
    await product.save();

    // fetch the product twice
    const firstInstance = await Product.findById(product.id);
    const secondInstance = await Product.findById(product.id);

    // make two separate changes to the products we fetched
    firstInstance!.set({ price: 100 });
    secondInstance!.set({ price: 15 });

    console.log(`[Test] First Instance Version: ${firstInstance!.version}`);
    console.log(`[Test] Second Instance Version: ${secondInstance!.version}`);

    // save the first fetched product
    await firstInstance!.save();
    console.log(`[Test] First Instance Saved`);

    // save the second fetched product and expect an error
    try {
        await secondInstance!.save();
        console.log(`[Test] Second Instance Saved (UNEXPECTED)`);
    } catch (err) {
        console.log(`[Test] Caught Error:`, err);
        return;
    }

    throw new Error('Should not reach this point');
});
