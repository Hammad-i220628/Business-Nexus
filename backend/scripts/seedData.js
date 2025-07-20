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
    
    // Create sample users for testing
    const sampleUsers = [
      {
        name: 'Sarah Chen',
        email: 'sarah@techstartup.com',
        password: 'password123',
        role: 'entrepreneur',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        bio: 'Passionate about revolutionizing healthcare through AI technology.',
        location: 'San Francisco, CA',
        startup: 'MedAI Solutions',
        industry: 'Healthcare',
        fundingNeeded: 2000000,
        pitchSummary: 'AI-powered diagnostic platform that helps doctors make faster, more accurate diagnoses.',
        stage: 'mvp',
        teamSize: 8,
        website: 'https://medai.com'
      },
      {
        name: 'Alexandra Stone',
        email: 'alex@stonecapital.com',
        password: 'password123',
        role: 'investor',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        bio: 'Partner at Stone Capital with 15 years of experience in early-stage investments.',
        location: 'Silicon Valley, CA',
        company: 'Stone Capital Partners',
        investmentRange: { min: 500000, max: 10000000 },
        industries: ['Technology', 'Healthcare', 'Fintech'],
        portfolio: ['TechCorp', 'HealthPlus', 'FinanceAI']
      },
      {
        name: 'Marcus Rodriguez',
        email: 'marcus@greentechco.com',
        password: 'password123',
        role: 'entrepreneur',
        avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        bio: 'Building sustainable solutions for renewable energy storage.',
        location: 'Austin, TX',
        startup: 'EcoStore Energy',
        industry: 'Clean Technology',
        fundingNeeded: 5000000,
        pitchSummary: 'Next-generation battery technology for renewable energy storage.',
        stage: 'growth',
        teamSize: 15
      },
      {
        name: 'David Kim',
        email: 'david@fintech.io',
        password: 'password123',
        role: 'entrepreneur',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        bio: 'Revolutionizing financial services for the next generation.',
        location: 'Seattle, WA',
        startup: 'PayFlow',
        industry: 'Fintech',
        fundingNeeded: 3000000,
        pitchSummary: 'Digital banking platform designed for Gen Z with AI-powered financial planning.',
        stage: 'mvp',
        teamSize: 12,
        website: 'https://payflow.com'
      },
      {
        name: 'Robert Johnson',
        email: 'robert@innovatevc.com',
        password: 'password123',
        role: 'investor',
        avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        bio: 'Managing Director at Innovate VC, focused on disruptive technologies.',
        location: 'Boston, MA',
        company: 'Innovate Venture Capital',
        investmentRange: { min: 1000000, max: 25000000 },
        industries: ['AI/ML', 'Clean Technology', 'Biotech'],
        portfolio: ['AI Dynamics', 'CleanTech Pro', 'BioInnovate']
      },
      {
        name: 'Jennifer Martinez',
        email: 'jennifer@futureventures.com',
        password: 'password123',
        role: 'investor',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        bio: 'Senior Partner at Future Ventures, specializing in early-stage tech investments.',
        location: 'Los Angeles, CA',
        company: 'Future Ventures',
        investmentRange: { min: 250000, max: 5000000 },
        industries: ['Technology', 'SaaS', 'Mobile Apps'],
        portfolio: ['AppTech', 'CloudSoft', 'MobilePay']
      }
    ];

    for (const userData of sampleUsers) {
      await User.create(userData);
    }
    
    console.log('✅ Sample users created successfully');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
};

const run = async () => {
  await connectDB();
  await seedUsers();
  mongoose.connection.close();
  console.log('🌱 Seeding complete');
};

run();