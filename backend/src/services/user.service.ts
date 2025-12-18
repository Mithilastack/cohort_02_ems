import { User } from '../models/user.model';
import * as uploadService from './upload.service';
import { logger } from '../utils/logger';

/**
 * Get user profile
 * @param userId - User ID
 * @returns User profile data
 */
export const getProfile = async (userId: string) => {
    const user = await User.findById(userId).select('-password');

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

/**
 * Update user profile
 * @param userId - User ID
 * @param updateData - Data to update
 * @param avatarBuffer - Optional avatar image buffer
 * @returns Updated user profile
 */
export const updateProfile = async (
    userId: string,
    updateData: { name?: string; phone?: string },
    avatarBuffer?: Buffer
) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    // Update basic fields
    if (updateData.name) user.name = updateData.name;
    if (updateData.phone !== undefined) user.phone = updateData.phone;

    // Upload avatar if provided
    if (avatarBuffer) {
        try {
            const avatarUrl = await uploadService.uploadImage(avatarBuffer, 'ems/users');
            user.avatar = avatarUrl;
        } catch (error) {
            logger.error('Failed to upload avatar:', error);
            throw new Error('Failed to upload avatar image');
        }
    }

    await user.save();

    return user;
};

/**
 * Change user password
 * @param userId - User ID
 * @param oldPassword - Current password
 * @param newPassword - New password
 */
export const changePassword = async (
    userId: string,
    oldPassword: string,
    newPassword: string
) => {
    const user = await User.findById(userId).select('+password');

    if (!user) {
        throw new Error('User not found');
    }

    // Verify old password
    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
};

/**
 * Get all users (Admin only)
 * @param filters - Search and pagination filters
 * @returns Users list with pagination
 */
export const getAllUsers = async (filters: {
    search?: string;
    isBlocked?: string;
    page?: number;
    limit?: number;
}) => {
    const { search, isBlocked, page = 1, limit = 10 } = filters;

    const query: any = {
        role: 'user', // Only return users with 'user' role, exclude admins
    };

    // Search by name or email
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
        ];
    }

    // Filter by blocked status
    if (isBlocked !== undefined) {
        query.isBlocked = isBlocked === 'true';
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        User.countDocuments(query),
    ]);

    return {
        users,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
};

/**
 * Update user status (block/unblock) - Admin only
 * @param userId - User ID
 * @param isBlocked - Block status
 * @returns Updated user
 */
export const updateUserStatus = async (userId: string, isBlocked: boolean) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    if (user.role === 'admin') {
        throw new Error('Cannot block/unblock admin users');
    }

    user.isBlocked = isBlocked;
    await user.save();

    return user;
};
