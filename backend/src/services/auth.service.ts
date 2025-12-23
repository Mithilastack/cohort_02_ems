import { User } from '../models/user.model';
import { OTP } from '../models/OTP.model';
import { generateToken } from '../utils/generateToken';
import { generateOTP } from '../utils/generateOTP';
import { emailService } from '../utils/emailService';
import { logger } from '../utils/logger';

/**
 * Register a new user
 * @param name - User's name
 * @param email - User's email
 * @param password - User's password
 * @returns JWT token and user data
 */
export const signup = async (name: string, email: string, password: string) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // Create new user
    const user = new User({
        name,
        email,
        password,
        role: 'user',
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role, user.email);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

/**
 * Login user
 * @param email - User's email
 * @param password - User's password
 * @returns JWT token and user data
 */
export const login = async (email: string, password: string) => {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Check if user is blocked
    if (user.isBlocked) {
        throw new Error('Your account has been blocked. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role, user.email);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        },
    };
};

/**
 * Request password reset (send OTP)
 * @param email - User's email
 */
export const forgotPassword = async (email: string) => {
    // Find user
    const user = await User.findOne({ email });

    if (!user) {
        // Don't reveal if user exists for security
        return { message: 'If an account exists with this email, you will receive a password reset OTP' };
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Save new OTP
    await OTP.create({
        email,
        otp,
        expiresAt,
    });

    // Send OTP email
    try {
        await emailService.sendOTPEmail(email, otp, 'reset');
        logger.info(`Password reset OTP sent to ${email}`);
    } catch (emailError) {
        logger.error('Failed to send OTP email:', emailError);
        throw new Error('Failed to send OTP. Please try again later.');
    }

    return { message: 'Password reset OTP sent to your email' };
};

/**
 * Reset password with OTP
 * @param email - User's email
 * @param otp - OTP code
 * @param newPassword - New password
 */
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
    // Find OTP
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
        throw new Error('Invalid or expired OTP');
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
        await OTP.deleteOne({ _id: otpRecord._id });
        throw new Error('OTP has expired');
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('User not found');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    logger.info(`Password reset successful for ${email}`);

    return { message: 'Password reset successful. You can now login with your new password.' };
};
