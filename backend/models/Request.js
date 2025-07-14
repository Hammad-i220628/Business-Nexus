import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Investor is required']
  },
  entrepreneur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Entrepreneur is required']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  responseMessage: {
    type: String,
    maxlength: [1000, 'Response message cannot exceed 1000 characters']
  },
  respondedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
// requestSchema.index({ investor: 1, entrepreneur: 1 }); // REMOVE: duplicate
requestSchema.index({ status: 1 });
requestSchema.index({ createdAt: -1 });

// Ensure unique request per investor-entrepreneur pair
requestSchema.index({ investor: 1, entrepreneur: 1 }, { unique: true });

export default mongoose.model('Request', requestSchema);