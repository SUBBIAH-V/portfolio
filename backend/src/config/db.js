import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_db';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000 // Quick timeout if no local MongoDB running
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning]: Connection failed (${error.message}). Operating with local storage / memory fallback mode.`);
    return false;
  }
};
