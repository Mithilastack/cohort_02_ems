import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { logger } from '../utils/logger';

/**
 * @desc    Get user profile
 * @route   GET /api/profile
 * @access  Private
 */
export const getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?._id?.toString();

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }

        const user = await userService.getProfile(userId);

        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: { user },
        });
    } catch (error: any) {
        logger.error('Error getting profile:', error);
        next(error);
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/profile
 * @access  Private
 */
export const updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?._id?.toString();

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }

        const { name, phone } = req.body;
        const avatarBuffer = req.file?.buffer;

        logger.info(`Profile update request for user ${userId}:`, {
            name,
            phone,
            hasAvatar: !!avatarBuffer,
            avatarSize: avatarBuffer?.length,
        });

        const user = await userService.updateProfile(
            userId,
            { name, phone },
            avatarBuffer
        );

        logger.info(`Profile updated successfully for user ${userId}`);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: { user },
        });
    } catch (error: any) {
        logger.error('Error updating profile:', error);

        if (error.message.includes('upload')) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
            return;
        }

        next(error);
    }
};

/**
 * @desc    Change password
 * @route   PUT /api/profile/password
 * @access  Private
 */
export const changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?._id?.toString();

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            res.status(400).json({
                success: false,
                message: 'Please provide old password and new password',
            });
            return;
        }

        const result = await userService.changePassword(userId, oldPassword, newPassword);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error: any) {
        logger.error('Error changing password:', error);

        if (error.message === 'Current password is incorrect') {
            res.status(400).json({
                success: false,
                message: error.message,
            });
            return;
        }

        next(error);
    }
};
