import mongoose from 'mongoose';
import config from '../config';

export const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    await mongoose.connection.close();
    console.log('🛑 MongoDB connection closed');
};

export const resetDB = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            throw new Error('❌ Database is not connected');
        }

        const db = mongoose.connection.db;
        if (!db) {
            throw new Error(
                '❌ Mongoose connection does not have a valid database instance'
            );
        }

        await db.dropDatabase();
        console.log('✅ Database reset successfully');
    } catch (error) {
        console.error('⚠️ Failed to reset database:', error);
        throw error;
    }
};
