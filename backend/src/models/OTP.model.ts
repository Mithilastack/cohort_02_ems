import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
    email: string;
    otp: string;
    expiresAt: Date;
    createdAt: Date;
}

const otpSchema = new Schema<IOTP>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
        },
        otp: {
            type: String,
            required: [true, 'OTP is required'],
        },
        expiresAt: {
            type: Date,
            required: [true, 'Expiry date is required'],
            index: { expires: 0 }, // TTL index - auto-delete when expired
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for fast lookups
otpSchema.index({ email: 1, otp: 1 });

export const OTP = mongoose.model<IOTP>('OTP', otpSchema);
