import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { connectDB } from '../config/db';
import { logger } from '../utils/logger';

const seedAdmin = async () => {
    try {
        // Connect to database
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            logger.info('Admin user already exists');
            logger.info(`Email: ${existingAdmin.email}`);
            process.exit(0);
        }

        // Create default admin user
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@ems.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const adminName = process.env.ADMIN_NAME || 'Admin User';

        if (!adminEmail || !adminPassword || !adminName) {
            logger.error('Admin credentials are not properly configured in .env file');
            process.exit(1);
        }

        const admin = new User({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
            isBlocked: false,
        });

        await admin.save();

        logger.info('✅ Admin user created successfully!');
        logger.info(`Email: ${adminEmail}`);
        logger.info(`Password: ${adminPassword}`);
        logger.info('⚠️  Please change the password after first login');

        process.exit(0);
    } catch (error) {
        logger.error('Error seeding admin user:', error);
        process.exit(1);
    }
};

// Run the seeder
seedAdmin();
