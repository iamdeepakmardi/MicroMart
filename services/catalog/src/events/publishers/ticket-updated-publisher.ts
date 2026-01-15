import { Publisher, Subjects, TicketUpdatedEvent } from '@micromart/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
