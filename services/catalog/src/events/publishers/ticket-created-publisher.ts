import { Publisher, Subjects, TicketCreatedEvent } from '@micromart/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
