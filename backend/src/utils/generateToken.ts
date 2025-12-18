import jwt from 'jsonwebtoken';

/**
 * Generate JWT token with user ID
 * @param userId - User ID to encode in token
 * @returns JWT token string
 */
export const generateToken = (userId: string): string => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign({ userId }, jwtSecret, {
        expiresIn: '30d', // Token expires in 30 days
    });
};
