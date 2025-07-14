import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Request from '../models/Request.js';
import Message from '../models/Message.js';

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

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create entrepreneurs
    const entrepreneurs = [
      {
        name: 'Sarah Chen',
        email: 'sarah@techstartup.com',
        password: hashedPassword,
        role: 'entrepreneur',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        bio: 'Passionate about revolutionizing healthcare through AI technology.',
        location: 'San Francisco, CA',
        startup: 'MedAI Solutions',
        industry: 'Healthcare',
        fundingNeeded: 2000000,
        pitchSummary: 'AI-powered diagnostic platform that helps doctors make faster, more accurate diagnoses using machine learning algorithms.',
        stage: 'mvp',
        teamSize: 8,
        website: 'https://medai.com',
        linkedin: 'https://linkedin.com/in/sarahchen'
      },
      {
        name: 'Marcus Rodriguez',
        email: 'marcus@greentechco.com',
        password: hashedPassword,
        role: 'entrepreneur',
        avatar: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        bio: 'Building sustainable solutions for renewable energy storage.',
        location: 'Austin, TX',
        startup: 'EcoStore Energy',
        industry: 'Clean Technology',
        fundingNeeded: 5000000,
        pitchSummary: 'Next-generation battery technology for renewable energy storage with 3x longer lifespan and 50% cost reduction.',
        stage: 'growth',
        teamSize: 15,
        website: 'https://ecostore.energy',
        linkedin: 'https://linkedin.com/in/marcusrodriguez'
      },
      {
        name: 'Emily Watson',
        email: 'emily@edutechpro.com',
        password: hashedPassword,
        role: 'entrepreneur',
        avatar: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        bio: 'Democratizing education through personalized learning platforms.',
        location: 'New York, NY',
        startup: 'LearnSmart',
        industry: 'Education',
        fundingNeeded: 1500000,
        pitchSummary: 'Adaptive learning platform that personalizes education for K-12 students using AI-driven curriculum adjustments.',
        stage: 'prototype',
        teamSize: 5,
        website: 'https://learnsmart.edu',
        linkedin: 'https://linkedin.com/in/emilywatson'
      },
      {
        name: 'David Kim',
        email: 'david@fintech.io',
        password: hashedPassword,
        role: 'entrepreneur',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        bio: 'Revolutionizing financial services for the next generation.',
        location: 'Seattle, WA',
        startup: 'PayFlow',
        industry: 'Fintech',
        fundingNeeded: 3000000,
        pitchSummary: 'Digital banking platform designed for Gen Z with AI-powered financial planning and investment tools.',
        stage: 'mvp',
        teamSize: 12,
        website: 'https://payflow.com',
        linkedin: 'https://linkedin.com/in/davidkim'
      }
    ];

    // Create investors
    const investors = [
      {
        name: 'Alexandra Stone',
        email: 'alex@stonecapital.com',
        password: hashedPassword,
        role: 'investor',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        bio: 'Partner at Stone Capital with 15 years of experience in early-stage investments.',
        location: 'Silicon Valley, CA',
        company: 'Stone Capital Partners',
        investmentRange: { min: 500000, max: 10000000 },
        industries: ['Technology', 'Healthcare', 'Fintech'],
        portfolio: ['TechCorp', 'HealthPlus', 'FinanceAI', 'MedTech Solutions'],
        linkedin: 'https://linkedin.com/in/alexandrastone',
        twitter: 'https://twitter.com/alexstone'
      },
      {
        name: 'Robert Johnson',
        email: 'robert@innovatevc.com',
        password: hashedPassword,
        role: 'investor',
        avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        bio: 'Managing Director at Innovate VC, focused on disruptive technologies.',
        location: 'Boston, MA',
        company: 'Innovate Venture Capital',
        investmentRange: { min: 1000000, max: 25000000 },
        industries: ['AI/ML', 'Clean Technology', 'Biotech'],
        portfolio: ['AI Dynamics', 'CleanTech Pro', 'BioInnovate', 'Neural Networks Inc'],
        linkedin: 'https://linkedin.com/in/robertjohnson',
        twitter: 'https://twitter.com/robertjohnsonvc'
      },
      {
        name: 'Jennifer Liu',
        email: 'jennifer@futureventures.com',
        password: hashedPassword,
        role: 'investor',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        bio: 'Senior Partner at Future Ventures, specializing in early-stage tech investments.',
        location: 'Los Angeles, CA',
        company: 'Future Ventures',
        investmentRange: { min: 250000, max: 5000000 },
        industries: ['Technology', 'SaaS', 'Mobile Apps'],
        portfolio: ['AppTech', 'CloudSoft', 'MobilePay', 'DataViz'],
        linkedin: 'https://linkedin.com/in/jenniferliu',
        twitter: 'https://twitter.com/jenniferliu'
      }
    ];

    // Insert users
    const createdEntrepreneurs = await User.insertMany(entrepreneurs);
    const createdInvestors = await User.insertMany(investors);
    
    console.log(`✅ Created ${createdEntrepreneurs.length} entrepreneurs`);
    console.log(`✅ Created ${createdInvestors.length} investors`);

    // Create some collaboration requests
    const requests = [
      {
        investor: createdInvestors[0]._id,
        entrepreneur: createdEntrepreneurs[0]._id,
        status: 'pending',
        message: 'Your MedAI Solutions project aligns perfectly with our healthcare investment thesis. Would love to discuss a potential partnership.'
      },
      {
        investor: createdInvestors[1]._id,
        entrepreneur: createdEntrepreneurs[1]._id,
        status: 'accepted',
        message: 'EcoStore Energy represents exactly the kind of clean technology innovation we\'re looking for. Let\'s schedule a meeting.',
        responseMessage: 'Thank you for your interest! I\'d be happy to discuss our technology and funding needs.',
        respondedAt: new Date()
      },
      {
        investor: createdInvestors[0]._id,
        entrepreneur: createdEntrepreneurs[2]._id,
        status: 'rejected',
        message: 'LearnSmart shows promise in the education sector. We\'d like to explore investment opportunities.',
        responseMessage: 'Thank you for your interest, but we\'re currently focused on other funding sources.',
        respondedAt: new Date()
      }
    ];

    const createdRequests = await Request.insertMany(requests);
    console.log(`✅ Created ${createdRequests.length} collaboration requests`);

    // Create some sample messages
    const messages = [
      {
        sender: createdInvestors[0]._id,
        receiver: createdEntrepreneurs[0]._id,
        content: 'Hi Sarah! I\'m very interested in your MedAI Solutions project. Could we schedule a call this week?'
      },
      {
        sender: createdEntrepreneurs[0]._id,
        receiver: createdInvestors[0]._id,
        content: 'Hi Alexandra! Absolutely, I\'d love to discuss the project with you. I\'m available Tuesday or Wednesday afternoon.'
      },
      {
        sender: createdInvestors[0]._id,
        receiver: createdEntrepreneurs[0]._id,
        content: 'Perfect! How about Wednesday at 2 PM? I\'ll send you a calendar invite.'
      },
      {
        sender: createdInvestors[1]._id,
        receiver: createdEntrepreneurs[1]._id,
        content: 'Marcus, congratulations on the impressive progress with EcoStore Energy! When can we move forward with the due diligence process?'
      },
      {
        sender: createdEntrepreneurs[1]._id,
        receiver: createdInvestors[1]._id,
        content: 'Thank you, Robert! I can have our data room ready by Monday. Should we also schedule a technical presentation for your team?'
      }
    ];

    const createdMessages = await Message.insertMany(messages);
    console.log(`✅ Created ${createdMessages.length} messages`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📧 Demo login credentials:');
    console.log('Entrepreneurs:');
    entrepreneurs.forEach(e => console.log(`  ${e.email} / password123`));
    console.log('Investors:');
    investors.forEach(i => console.log(`  ${i.email} / password123`));

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