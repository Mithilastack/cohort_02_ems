import mongoose, { Document, Schema } from 'mongoose';

// Booking interface
export interface IBooking extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    event: mongoose.Types.ObjectId;
    quantity: number;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    bookedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Booking schema
const bookingSchema = new Schema<IBooking>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required'],
        },
        event: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: [true, 'Event is required'],
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1'],
        },
        totalAmount: {
            type: Number,
            required: [true, 'Total amount is required'],
            min: [0, 'Total amount cannot be negative'],
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending',
        },
        bookedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient queries
bookingSchema.index({ user: 1, bookedAt: -1 });
bookingSchema.index({ event: 1 });
bookingSchema.index({ status: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
