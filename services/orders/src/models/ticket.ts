import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// Interface for Ticket attributes (what we provide when building)
interface TicketAttrs {
    id: string; // Add id to attrs
    title: string;
    price: number;
}

// Interface for Ticket Document (what properties the document has)
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    id: string;
    isReserved(): Promise<boolean>;
}

// Interface for Ticket Model (statics)
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    // ... existing schema ...
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    optimisticConcurrency: true,
    versionKey: 'version'
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id, // Map id to _id
        title: attrs.title,
        price: attrs.price
    });
};

// Run query to look for orders. 
// Find an order where the ticket is the ticket we just found *and* the order's status is *not* cancelled.
// If we find an order from that means the ticket *is* reserved
ticketSchema.methods.isReserved = async function () {
    // this === the ticket document that we just called 'isReserved' on
    const existingOrder = await Order.findOne({
        ticket: this as any, // Mongoose typing quirk
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });

    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
