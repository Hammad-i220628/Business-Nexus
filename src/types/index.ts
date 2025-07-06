export interface User {
  id: string;
  name: string;
  email: string;
  role: 'investor' | 'entrepreneur';
  avatar?: string;
  bio?: string;
  location?: string;
  createdAt: string;
}

export interface Entrepreneur extends User {
  role: 'entrepreneur';
  startup: string;
  industry: string;
  fundingNeeded: number;
  pitchSummary: string;
  stage: 'idea' | 'prototype' | 'mvp' | 'growth' | 'expansion';
  teamSize: number;
  website?: string;
  linkedin?: string;
}

export interface Investor extends User {
  role: 'investor';
  company: string;
  investmentRange: {
    min: number;
    max: number;
  };
  industries: string[];
  portfolio: string[];
  linkedin?: string;
  twitter?: string;
}

export interface CollaborationRequest {
  id: string;
  investorId: string;
  entrepreneurId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  updatedAt: string;
}