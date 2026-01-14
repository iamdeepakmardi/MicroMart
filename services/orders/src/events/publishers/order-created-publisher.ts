import { Publisher, Subjects, OrderCreatedEvent } from '@micromart/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
