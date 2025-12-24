import { Event, IEvent } from '../models/Event.model';
import mongoose from 'mongoose';

interface EventFilters {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
}

/**
 * Create a new event (Admin only)
 * @param eventData - Event data
 * @returns Created event
 */
export const createEvent = async (eventData: Partial<IEvent>) => {
    const event = new Event(eventData);
    await event.save();
    return event;
};

/**
 * Get all events with pagination and filters
 * @param filters - Search, category, pagination filters
 * @returns Events list with pagination info
 */
export const getAllEvents = async (filters: EventFilters) => {
    const { search, category, page = 1, limit = 10 } = filters;

    const query: any = {};

    // Text search
    if (search) {
        query.$text = { $search: search };
    }

    // Category filter
    if (category) {
        query.category = category;
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
        Event.find(query)
            .select('-__v')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Event.countDocuments(query),
    ]);

    return {
        events,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get single event by ID
 * @param eventId - Event ID
 * @returns Event details
 */
export const getEventById = async (eventId: string) => {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new Error('Invalid event ID');
    }

    const event = await Event.findById(eventId).select('-__v');

    if (!event) {
        throw new Error('Event not found');
    }

    return event;
};

/**
 * Update event (Admin only)
 * @param eventId - Event ID
 * @param updateData - Data to update
 * @returns Updated event
 */
export const updateEvent = async (eventId: string, updateData: Partial<IEvent>) => {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new Error('Invalid event ID');
    }

    const event = await Event.findByIdAndUpdate(
        eventId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select('-__v');

    if (!event) {
        throw new Error('Event not found');
    }

    return event;
};

/**
 * Delete event (Admin only)
 * @param eventId - Event ID
 * @returns Deleted event
 */
export const deleteEvent = async (eventId: string) => {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new Error('Invalid event ID');
    }

    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
        throw new Error('Event not found');
    }

    return event;
};

/**
 * Get event details with bookings and user information (Admin only)
 * @param eventId - Event ID
 * @returns Event details with bookings
 */
export const getEventWithBookings = async (eventId: string) => {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new Error('Invalid event ID');
    }

    const event = await Event.findById(eventId).select('-__v');

    if (!event) {
        throw new Error('Event not found');
    }

    // Import Booking model here to avoid circular dependency
    const { Booking } = await import('../models/Booking.model');

    // Get all bookings for this event with user details populated
    const bookings = await Booking.find({ event: eventId })
        .populate('user', 'name email phone createdAt')
        .select('-__v')
        .sort({ bookedAt: -1 });

    return {
        event,
        bookings,
        summary: {
            totalBookings: bookings.length,
            confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
            pendingBookings: bookings.filter(b => b.status === 'pending').length,
            cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
            totalRevenue: bookings
                .filter(b => b.status !== 'cancelled')
                .reduce((sum, b) => sum + b.totalAmount, 0),
            totalSeatsBooked: bookings
                .filter(b => b.status !== 'cancelled')
                .reduce((sum, b) => sum + b.quantity, 0),
        }
    };
};

