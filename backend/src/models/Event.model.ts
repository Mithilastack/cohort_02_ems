import mongoose, { Document, Schema } from 'mongoose';

// Guest/Artist interface
export interface IGuest {
    name: string;
    role?: string;
    bio?: string;
    imageUrl?: string;
}

// Event interface
export interface IEvent extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    date: Date;
    time: string;
    venue: string;
    category: string;
    bannerUrl: string;
    totalSeats: number;
    availableSeats: number;
    price: number;
    organizer: string;

    // Optional extended fields
    address?: string;
    registrationStartDate?: Date;
    registrationEndDate?: Date;
    eventStartDate?: Date;
    eventEndDate?: Date;
    startTime?: string;
    endTime?: string;
    guests?: IGuest[];
    registrationStatus?: 'comingsoon' | 'open' | 'closed';

    // Virtual field
    computedRegistrationStatus?: string;

    createdAt: Date;
    updatedAt: Date;
}

// Guest schema
const guestSchema = new Schema<IGuest>(
    {
        name: {
            type: String,
            required: [true, 'Guest name is required'],
            trim: true,
        },
        role: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
        },
        imageUrl: {
            type: String,
            trim: true,
        },
    },
    { _id: false }
);

// Event schema
const eventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: [true, 'Event title is required'],
            maxlength: [100, 'Title cannot exceed 100 characters'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Event description is required'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
            trim: true,
        },
        date: {
            type: Date,
            required: [true, 'Event date is required'],
        },
        time: {
            type: String,
            required: [true, 'Event time is required'],
            trim: true,
        },
        venue: {
            type: String,
            required: [true, 'Venue is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        bannerUrl: {
            type: String,
            required: [true, 'Banner URL is required'],
            trim: true,
        },
        totalSeats: {
            type: Number,
            required: [true, 'Total seats is required'],
            min: [1, 'Total seats must be at least 1'],
        },
        availableSeats: {
            type: Number,
            required: [true, 'Available seats is required'],
            min: [0, 'Available seats cannot be negative'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        organizer: {
            type: String,
            required: [true, 'Organizer is required'],
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        registrationStartDate: {
            type: Date,
        },
        registrationEndDate: {
            type: Date,
        },
        eventStartDate: {
            type: Date,
        },
        eventEndDate: {
            type: Date,
        },
        startTime: {
            type: String,
            trim: true,
        },
        endTime: {
            type: String,
            trim: true,
        },
        guests: [guestSchema],
        registrationStatus: {
            type: String,
            enum: ['comingsoon', 'open', 'closed'],
            default: 'comingsoon',
        },
    },
    {
        timestamps: true,
    }
);

// Text search index
eventSchema.index({
    title: 'text',
    description: 'text',
    category: 'text',
});

// Virtual field for computed registration status
eventSchema.virtual('computedRegistrationStatus').get(function () {
    const now = new Date();

    if (this.registrationStartDate && this.registrationEndDate) {
        if (now < this.registrationStartDate) {
            return 'comingsoon';
        } else if (now >= this.registrationStartDate && now <= this.registrationEndDate) {
            return 'open';
        } else {
            return 'closed';
        }
    }

    return this.registrationStatus;
});

// Ensure virtuals are included in JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

export const Event = mongoose.model<IEvent>('Event', eventSchema);
