import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Request from '../models/Request.js';
import Message from '../models/Message.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Request.deleteMany({});
    await Message.deleteMany({});
    console.log('🗑️  Cleared existing data');
    // No demo users or data inserted
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
  }
};

const run = async () => {
  await connectDB();
  await seedUsers();
  mongoose.connection.close();
  console.log('🌱 Seeding complete');
};

run();