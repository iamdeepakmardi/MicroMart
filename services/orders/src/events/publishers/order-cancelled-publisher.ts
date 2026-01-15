import { Publisher, Subjects, OrderCancelledEvent } from '@micromart/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
