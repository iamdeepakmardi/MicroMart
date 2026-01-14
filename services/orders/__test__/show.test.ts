import request from 'supertest';
import { app } from '../src/app';
import { Ticket } from '../src/models/ticket';
import mongoose from 'mongoose';

it('fetches the order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const user = global.signin();

    // make a request to build an order with this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${user[0]}`)
        .send({ ticketId: ticket.id })
        .expect(201);

    // make request to fetch the order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Authorization', `Bearer ${user[0]}`)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const user = global.signin();

    // make a request to build an order with this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${user[0]}`)
        .send({ ticketId: ticket.id })
        .expect(201);

    // make request to fetch the order as another user
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Authorization', `Bearer ${global.signin()[0]}`)
        .send()
        .expect(401);
});

it('returns error if order does not exist', async () => {
    const orderId = new mongoose.Types.ObjectId();
    await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${global.signin()[0]}`)
        .send()
        .expect(404);
});
