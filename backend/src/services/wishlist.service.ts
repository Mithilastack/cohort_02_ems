import { User } from '../models/user.model';
import { Event } from '../models/Event.model';
import mongoose from 'mongoose';

/**
 * Get user's wishlist with populated event details
 * @param userId - User ID
 * @returns User's wishlist with populated events
 */
export const getWishlist = async (userId: string) => {
    const user = await User.findById(userId).populate({
        path: 'wishlist',
        select: '_id title description date time venue category bannerUrl price organizer availableSeats totalSeats',
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user.wishlist || [];
};

/**
 * Add event to user's wishlist
 * @param userId - User ID
 * @param eventId - Event ID to add
 * @returns Updated wishlist
 */
export const addToWishlist = async (userId: string, eventId: string) => {
    // Validate event ID format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new Error('Invalid event ID');
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
        throw new Error('Event not found');
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Check if event is already in wishlist
    const eventObjectId = new mongoose.Types.ObjectId(eventId);
    const isAlreadyInWishlist = user.wishlist.some(
        (id) => id.toString() === eventObjectId.toString()
    );

    if (isAlreadyInWishlist) {
        throw new Error('Event is already in your wishlist');
    }

    // Add event to wishlist
    user.wishlist.push(eventObjectId);
    await user.save();

    // Return updated wishlist with populated events
    const updatedUser = await User.findById(userId).populate({
        path: 'wishlist',
        select: '_id title description date time venue category bannerUrl price organizer availableSeats totalSeats',
    });

    return updatedUser?.wishlist || [];
};

/**
 * Remove event from user's wishlist
 * @param userId - User ID
 * @param eventId - Event ID to remove
 * @returns Updated wishlist
 */
export const removeFromWishlist = async (userId: string, eventId: string) => {
    // Validate event ID format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new Error('Invalid event ID');
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Check if event is in wishlist
    const eventObjectId = new mongoose.Types.ObjectId(eventId);
    const eventIndex = user.wishlist.findIndex(
        (id) => id.toString() === eventObjectId.toString()
    );

    if (eventIndex === -1) {
        throw new Error('Event is not in your wishlist');
    }

    // Remove event from wishlist
    user.wishlist.splice(eventIndex, 1);
    await user.save();

    // Return updated wishlist with populated events
    const updatedUser = await User.findById(userId).populate({
        path: 'wishlist',
        select: '_id title description date time venue category bannerUrl price organizer availableSeats totalSeats',
    });

    return updatedUser?.wishlist || [];
};
