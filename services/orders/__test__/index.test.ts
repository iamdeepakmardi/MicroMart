import request from 'supertest';
import { app } from '../src/app';
import { Order } from '../src/models/order';
import { Ticket } from '../src/models/ticket';
import mongoose from 'mongoose';

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();
    return ticket;
};

it('fetches orders for an particular user', async () => {
    // Create three tickets
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();

    // Create one order as User #1
    await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userOne[0]}`)
        .send({ ticketId: ticketOne.id })
        .expect(201);

    // Create two orders as User #2
    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userTwo[0]}`)
        .send({ ticketId: ticketTwo.id })
        .expect(201);
    const { body: orderTwo } = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userTwo[0]}`)
        .send({ ticketId: ticketThree.id })
        .expect(201);

    // Make request to get orders for User #2
    const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userTwo[0]}`)
        .expect(200);

    // Make sure we only got the orders for User #2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
