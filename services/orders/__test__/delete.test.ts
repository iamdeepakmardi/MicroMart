import request from 'supertest';
import { app } from '../src/app';
import { Order, OrderStatus } from '../src/models/order';
import { Ticket } from '../src/models/ticket';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
    // create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const user = global.signin();

    // make a request to create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${user[0]}`)
        .send({ ticketId: ticket.id })
        .expect(201);

    // make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Authorization', `Bearer ${user[0]}`)
        .send()
        .expect(204);

    // expectation to make sure the thing is cancelled
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('returns 404 if order not found', async () => {
    const orderId = new mongoose.Types.ObjectId();
    await request(app)
        .delete(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${global.signin()[0]}`)
        .expect(404);
});

it('returns 401 if user is not authorized', async () => {
    // create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const user = global.signin();

    // make a request to create an order
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${user[0]}`)
        .send({ ticketId: ticket.id })
        .expect(201);

    // make a request to cancel the order as another user
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Authorization', `Bearer ${global.signin()[0]}`)
        .expect(401);
});
