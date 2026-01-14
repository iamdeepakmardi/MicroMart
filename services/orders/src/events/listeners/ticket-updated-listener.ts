import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@micromart/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        // Find ticket by id and version - 1
        const ticket = await Ticket.findOne({
            _id: data.id,
            version: data.version - 1
        });

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        const { title, price, version } = data;

        // Update ticket with new data and version
        // Actually, if we use the plugin or native OCC, checking version-1 matches is key.
        // When we save, the version will act naturally or we explicitly set it.
        // Native OCC increments on save. We should just set the properties.
        // BUT we must ensure the version IS updated to the new version from the event?
        // Actually, if we just save, it increments. If events arrive out of order, the findOne fails.
        // So we just need to update title/price and save. The pre-save hook handles increment.

        ticket.set({ title, price });
        // ticket.set({ title, price, version }); // If we want to force sync version?
        // Let's rely on the concurrency check we wrote. 
        await ticket.save();

        msg.ack();
    }
}
