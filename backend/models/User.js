import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['entrepreneur', 'investor'],
    required: [true, 'Role is required']
  },
  avatar: {
    type: String,
    default: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  // Entrepreneur specific fields
  startup: {
    type: String,
    maxlength: [100, 'Startup name cannot exceed 100 characters']
  },
  industry: {
    type: String,
    maxlength: [50, 'Industry cannot exceed 50 characters']
  },
  fundingNeeded: {
    type: Number,
    min: [0, 'Funding needed cannot be negative']
  },
  pitchSummary: {
    type: String,
    maxlength: [1000, 'Pitch summary cannot exceed 1000 characters']
  },
  stage: {
    type: String,
    enum: ['idea', 'prototype', 'mvp', 'growth', 'expansion']
  },
  teamSize: {
    type: Number,
    min: [1, 'Team size must be at least 1']
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  linkedin: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  // Investor specific fields
  company: {
    type: String,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  investmentRange: {
    min: {
      type: Number,
      min: [0, 'Investment range minimum cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Investment range maximum cannot be negative']
    }
  },
  industries: [{
    type: String,
    maxlength: [50, 'Industry cannot exceed 50 characters']
  }],
  portfolio: [{
    type: String,
    maxlength: [100, 'Portfolio company name cannot exceed 100 characters']
  }],
  twitter: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  }
}, {
  timestamps: true
});

// Index for better query performance
// userSchema.index({ email: 1 }); // REMOVE: already covered by unique: true in schema
userSchema.index({ role: 1 });
userSchema.index({ industry: 1 });
userSchema.index({ 'investmentRange.min': 1, 'investmentRange.max': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model('User', userSchema);