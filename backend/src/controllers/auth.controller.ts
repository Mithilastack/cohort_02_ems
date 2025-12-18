import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { logger } from '../utils/logger';

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password',
            });
            return;
        }

        const result = await authService.signup(name, email, password);

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: result,
        });
    } catch (error: any) {
        logger.error('Error in signup:', error);

        if (error.message === 'User with this email already exists') {
            res.status(400).json({
                success: false,
                message: error.message,
            });
            return;
        }

        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
            return;
        }

        const result = await authService.login(email, password);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    } catch (error: any) {
        logger.error('Error in login:', error);

        if (error.message === 'Invalid credentials' || error.message.includes('blocked')) {
            res.status(401).json({
                success: false,
                message: error.message,
            });
            return;
        }

        next(error);
    }
};

/**
 * @desc    Request password reset
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Please provide email',
            });
            return;
        }

        const result = await authService.forgotPassword(email);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error: any) {
        logger.error('Error in forgotPassword:', error);

        if (error.message.includes('Failed to send OTP')) {
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
 * @desc    Reset password with OTP
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            res.status(400).json({
                success: false,
                message: 'Please provide email, OTP, and new password',
            });
            return;
        }

        const result = await authService.resetPassword(email, otp, newPassword);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error: any) {
        logger.error('Error in resetPassword:', error);

        if (error.message.includes('OTP') || error.message === 'User not found') {
            res.status(400).json({
                success: false,
                message: error.message,
            });
            return;
        }

        next(error);
    }
};
