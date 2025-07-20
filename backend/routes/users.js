import express from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all entrepreneurs (for investors)
// @route   GET /api/users/entrepreneurs
// @access  Private (Investors only)
router.get('/entrepreneurs', protect, authorize('investor'), async (req, res) => {
  try {
    const { page = 1, limit = 50, industry, search, minFunding, maxFunding } = req.query;
    
    // Build query
    const query = { role: 'entrepreneur', isActive: true };
    
    if (industry) {
      query.industry = new RegExp(industry, 'i');
    }
    
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { startup: new RegExp(search, 'i') },
        { pitchSummary: new RegExp(search, 'i') }
      ];
    }
    
    if (minFunding || maxFunding) {
      query.fundingNeeded = {};
      if (minFunding) query.fundingNeeded.$gte = parseInt(minFunding);
      if (maxFunding) query.fundingNeeded.$lte = parseInt(maxFunding);
    }

    const entrepreneurs = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }) // Newest first
      .lean(); // Better performance

    const total = await User.countDocuments(query);

    console.log(`Found ${entrepreneurs.length} entrepreneurs out of ${total} total`);

    res.json({
      success: true,
      data: entrepreneurs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching entrepreneurs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get all investors (for entrepreneurs)
// @route   GET /api/users/investors
// @access  Private (Entrepreneurs only)
router.get('/investors', protect, authorize('entrepreneur'), async (req, res) => {
  try {
    const { page = 1, limit = 50, industry, search, minInvestment, maxInvestment } = req.query;
    
    // Build query
    const query = { role: 'investor', isActive: true };
    
    if (industry) {
      query.industries = { $in: [new RegExp(industry, 'i')] };
    }
    
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
        { bio: new RegExp(search, 'i') }
      ];
    }
    
    if (minInvestment || maxInvestment) {
      const investmentQuery = {};
      if (minInvestment) investmentQuery['investmentRange.min'] = { $gte: parseInt(minInvestment) };
      if (maxInvestment) investmentQuery['investmentRange.max'] = { $lte: parseInt(maxInvestment) };
      Object.assign(query, investmentQuery);
    }

    const investors = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: investors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching investors:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/stats/dashboard
// @access  Private
router.get('/stats/dashboard', protect, async (req, res) => {
  try {
    const stats = {};
    
    if (req.user.role === 'investor') {
      const totalEntrepreneurs = await User.countDocuments({ 
        role: 'entrepreneur', 
        isActive: true 
      });
      
      const Request = (await import('../models/Request.js')).default;
      const activeRequests = await Request.countDocuments({
        investor: req.user.id,
        status: 'pending'
      });
      
      const acceptedRequests = await Request.countDocuments({
        investor: req.user.id,
        status: 'accepted'
      });
      
      stats.totalEntrepreneurs = totalEntrepreneurs;
      stats.activeRequests = activeRequests;
      stats.acceptedRequests = acceptedRequests;
      stats.thisMonth = totalEntrepreneurs; // Placeholder
      stats.messages = 0; // Placeholder
    } else {
      const totalInvestors = await User.countDocuments({ 
        role: 'investor', 
        isActive: true 
      });
      
      const Request = (await import('../models/Request.js')).default;
      const pendingRequests = await Request.countDocuments({
        entrepreneur: req.user.id,
        status: 'pending'
      });
      
      const acceptedRequests = await Request.countDocuments({
        entrepreneur: req.user.id,
        status: 'accepted'
      });
      
      stats.totalInvestors = totalInvestors;
      stats.pendingRequests = pendingRequests;
      stats.acceptedRequests = acceptedRequests;
      stats.profileViews = 1234; // Placeholder
      stats.messages = 156; // Placeholder
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;