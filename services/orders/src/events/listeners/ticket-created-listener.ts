import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@micromart/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price, version } = data;

        const ticket = Ticket.build({
            title,
            price
        });
        // We need to ensure we save the ID from the event, NOT generate a new one
        // But our current build method just takes attrs. We need to modify build or set _id manually.
        // Let's modify the document properties directly before save, or update the model.
        // Actually, easiest way is to set _id in the document creation or use set.

        // Wait, Ticket.build returns a hydration compatible doc.
        // Mongoose allows providing _id. Let's update Ticket model or just cast.

        // Better approach: modify Ticket model build to accept id.
        // For now, let's try to assign it.
        ticket.set({ _id: id, version });

        await ticket.save();

        msg.ack();
    }
}
