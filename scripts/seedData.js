import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Request from './models/Request.js';
import Message from './models/Message.js';

dotenv.config();

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

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create single demo user John
    const john = {
      name: 'John Smith',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'entrepreneur',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      bio: 'Passionate entrepreneur building innovative solutions.',
      location: 'New York, NY',
      startup: 'TechCorp',
      industry: 'Technology',
      fundingNeeded: 1000000,
      pitchSummary: 'Revolutionary tech platform that will change the world.',
      stage: 'mvp',
      teamSize: 5,
      website: 'https://techcorp.com',
      linkedin: 'https://linkedin.com/in/johnsmith'
    };

    // Insert user
    const createdUser = await User.create(john);
    
    console.log(`✅ Created demo user: John Smith`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📧 Demo login credentials:');
    console.log(`  ${john.email} / password123`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedUsers();
  await mongoose.connection.close();
  console.log('\n👋 Database connection closed');
  process.exit(0);
};

runSeed();