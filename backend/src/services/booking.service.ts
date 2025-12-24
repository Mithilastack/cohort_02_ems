import { Booking, IBooking } from '../models/Booking.model';
import { Event } from '../models/Event.model';
import { emailService } from '../utils/emailService';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

interface BookingFilters {
    status?: 'pending' | 'confirmed' | 'cancelled';
    page?: number;
    limit?: number;
}

/**
 * Create a new booking
 * @param userId - User ID
 * @param eventId - Event ID
 * @param quantity - Number of seats to book
 * @returns Created booking
 */
export const createBooking = async (userId: string, eventId: string, quantity: number) => {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new Error('Invalid event ID');
    }

    // Find event
    const event = await Event.findById(eventId);
    if (!event) {
        throw new Error('Event not found');
    }

    // Check availability
    if (event.availableSeats < quantity) {
        throw new Error(`Only ${event.availableSeats} seats available`);
    }

    // Calculate total amount
    const totalAmount = event.price * quantity;

    // Create booking
    const booking = new Booking({
        user: userId,
        event: eventId,
        quantity,
        totalAmount,
        status: 'pending',
    });

    // Reduce available seats
    event.availableSeats -= quantity;

    // Save both in parallel
    await Promise.all([booking.save(), event.save()]);

    // Populate booking with event details
    await booking.populate('event', 'title date time venue');

    // Send confirmation email (don't block on this)
    try {
        // You can implement email confirmation later
        logger.info(`Booking confirmation email should be sent for booking ${booking._id}`);
    } catch (emailError) {
        logger.error('Failed to send booking confirmation email:', emailError);
    }

    return booking;
};

/**
 * Get user's bookings
 * @param userId - User ID
 * @returns User's bookings with event details
 */
export const getMyBookings = async (userId: string) => {
    const bookings = await Booking.find({ user: userId })
        .populate('event', 'title description date time venue category bannerUrl')
        .sort({ bookedAt: -1 })
        .select('-__v');

    return bookings;
};

/**
 * Get all bookings (Admin only)
 * @param filters - Status and pagination filters
 * @returns Bookings list with pagination
 */
export const getAllBookings = async (filters: BookingFilters) => {
    const { status, page = 1, limit = 10 } = filters;

    const query: any = {};

    if (status) {
        query.status = status;
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
        Booking.find(query)
            .populate('user', 'name email')
            .populate('event', 'title date venue')
            .sort({ bookedAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v'),
        Booking.countDocuments(query),
    ]);

    return {
        bookings,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

/**
 * Update booking status (Admin only)
 * @param bookingId - Booking ID
 * @param status - New status
 * @returns Updated booking
 */
export const updateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new Error('Invalid booking ID');
    }

    const booking = await Booking.findById(bookingId).populate('event');

    if (!booking) {
        throw new Error('Booking not found');
    }

    const oldStatus = booking.status;

    // If cancelling a booking, restore seats
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
        const event = await Event.findById(booking.event);
        if (event) {
            event.availableSeats += booking.quantity;
            await event.save();
        }
    }

    // Update status
    booking.status = status;
    await booking.save();

    // Populate booking with user and event details for email
    await booking.populate('user', 'name email');
    await booking.populate('event', 'title date time venue');

    // Send notification email (don't block on this)
    try {
        const user = booking.user as any;
        const event = booking.event as any;

        if (user?.email && event) {
            // Format date for email
            const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            await emailService.sendBookingStatusUpdateEmail(user.email, {
                eventTitle: event.title,
                eventDate: eventDate,
                eventTime: event.time || 'TBA',
                venue: event.venue || 'TBA',
                quantity: booking.quantity,
                totalAmount: booking.totalAmount,
                status: status,
            });

            logger.info(`Status update notification email sent to ${user.email} for booking ${booking._id}`);
        }
    } catch (emailError) {
        logger.error('Failed to send status update email:', emailError);
        // Don't throw error - email failure shouldn't block booking update
    }

    return booking;
};
