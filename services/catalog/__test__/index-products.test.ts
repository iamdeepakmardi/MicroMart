import request from 'supertest';
import { app } from '../src/app';
import { Category } from '../src/models/category';
import { Product } from '../src/models/product';

const createProduct = async () => {
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
};

it('can fetch a list of products', async () => {
    await createProduct();
    await createProduct();
    await createProduct();

    // const count = await Product.countDocuments();
    // console.log(`DEBUG: Product Count in DB: ${count}`);

    const response = await request(app)
        .get('/api/products')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
});
