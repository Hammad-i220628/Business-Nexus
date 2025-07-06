import { User, Entrepreneur, Investor, CollaborationRequest, Message } from '../types';

export const mockEntrepreneurs: Entrepreneur[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@techstartup.com',
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
    linkedin: 'https://linkedin.com/in/sarahchen',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'marcus@greentechco.com',
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
    linkedin: 'https://linkedin.com/in/marcusrodriguez',
    createdAt: '2024-01-20T14:45:00Z'
  },
  {
    id: '3',
    name: 'Emily Watson',
    email: 'emily@edutechpro.com',
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
    linkedin: 'https://linkedin.com/in/emilywatson',
    createdAt: '2024-02-01T09:15:00Z'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@fintech.io',
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
    linkedin: 'https://linkedin.com/in/davidkim',
    createdAt: '2024-02-10T16:20:00Z'
  }
];

export const mockInvestors: Investor[] = [
  {
    id: '5',
    name: 'Alexandra Stone',
    email: 'alex@stonecapital.com',
    role: 'investor',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Partner at Stone Capital with 15 years of experience in early-stage investments.',
    location: 'Silicon Valley, CA',
    company: 'Stone Capital Partners',
    investmentRange: { min: 500000, max: 10000000 },
    industries: ['Technology', 'Healthcare', 'Fintech'],
    portfolio: ['TechCorp', 'HealthPlus', 'FinanceAI', 'MedTech Solutions'],
    linkedin: 'https://linkedin.com/in/alexandrastone',
    twitter: 'https://twitter.com/alexstone',
    createdAt: '2024-01-05T08:00:00Z'
  },
  {
    id: '6',
    name: 'Robert Johnson',
    email: 'robert@innovatevc.com',
    role: 'investor',
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Managing Director at Innovate VC, focused on disruptive technologies.',
    location: 'Boston, MA',
    company: 'Innovate Venture Capital',
    investmentRange: { min: 1000000, max: 25000000 },
    industries: ['AI/ML', 'Clean Technology', 'Biotech'],
    portfolio: ['AI Dynamics', 'CleanTech Pro', 'BioInnovate', 'Neural Networks Inc'],
    linkedin: 'https://linkedin.com/in/robertjohnson',
    twitter: 'https://twitter.com/robertjohnsonvc',
    createdAt: '2024-01-12T11:30:00Z'
  }
];

export const mockUsers: User[] = [...mockEntrepreneurs, ...mockInvestors];

export const mockCollaborationRequests: CollaborationRequest[] = [
  {
    id: '1',
    investorId: '5',
    entrepreneurId: '1',
    status: 'pending',
    message: 'Your MedAI Solutions project aligns perfectly with our healthcare investment thesis. Would love to discuss a potential partnership.',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z'
  },
  {
    id: '2',
    investorId: '6',
    entrepreneurId: '2',
    status: 'accepted',
    message: 'EcoStore Energy represents exactly the kind of clean technology innovation we\'re looking for. Let\'s schedule a meeting.',
    createdAt: '2024-02-12T14:30:00Z',
    updatedAt: '2024-02-14T09:15:00Z'
  },
  {
    id: '3',
    investorId: '5',
    entrepreneurId: '3',
    status: 'rejected',
    message: 'While LearnSmart is impressive, it\'s outside our current investment focus. Wishing you the best!',
    createdAt: '2024-02-08T16:45:00Z',
    updatedAt: '2024-02-10T11:20:00Z'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '5',
    receiverId: '1',
    content: 'Hi Sarah! I\'m very interested in your MedAI Solutions project. Could we schedule a call this week?',
    timestamp: '2024-02-15T10:15:00Z',
    read: true
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '5',
    content: 'Hi Alexandra! Absolutely, I\'d love to discuss the project with you. I\'m available Tuesday or Wednesday afternoon.',
    timestamp: '2024-02-15T11:30:00Z',
    read: true
  },
  {
    id: '3',
    senderId: '5',
    receiverId: '1',
    content: 'Perfect! How about Wednesday at 2 PM? I\'ll send you a calendar invite.',
    timestamp: '2024-02-15T12:00:00Z',
    read: false
  },
  {
    id: '4',
    senderId: '6',
    receiverId: '2',
    content: 'Marcus, congratulations on the impressive progress with EcoStore Energy! When can we move forward with the due diligence process?',
    timestamp: '2024-02-14T09:20:00Z',
    read: true
  },
  {
    id: '5',
    senderId: '2',
    receiverId: '6',
    content: 'Thank you, Robert! I can have our data room ready by Monday. Should we also schedule a technical presentation for your team?',
    timestamp: '2024-02-14T10:45:00Z',
    read: true
  }
];