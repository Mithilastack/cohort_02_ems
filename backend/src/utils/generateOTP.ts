/**
 * Generate a 6-digit numeric OTP
 * @returns 6-digit OTP as string
 */
export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
