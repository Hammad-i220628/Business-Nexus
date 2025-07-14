import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { profileUpdateValidation, validateRequest } from '../middleware/validation.js';

const router = express.Router();

// @desc    Get current user profile
// @route   GET /api/profiles/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
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

// @desc    Update current user profile
// @route   PUT /api/profiles/me
// @access  Private
router.put('/me', protect, profileUpdateValidation, validateRequest, async (req, res) => {
  try {
    const allowedFields = [
      'name', 'bio', 'location', 'avatar',
      // Entrepreneur fields
      'startup', 'industry', 'fundingNeeded', 'pitchSummary', 
      'stage', 'teamSize', 'website', 'linkedin',
      // Investor fields
      'company', 'investmentRange', 'industries', 'portfolio', 'twitter'
    ];

    const updateData = {};
    
    // Only include allowed fields that are present in request
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    // Validate role-specific fields
    if (req.user.role === 'entrepreneur') {
      // Remove investor-specific fields
      delete updateData.company;
      delete updateData.investmentRange;
      delete updateData.industries;
      delete updateData.portfolio;
      delete updateData.twitter;
    } else if (req.user.role === 'investor') {
      // Remove entrepreneur-specific fields
      delete updateData.startup;
      delete updateData.industry;
      delete updateData.fundingNeeded;
      delete updateData.pitchSummary;
      delete updateData.stage;
      delete updateData.teamSize;
      delete updateData.website;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
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

// @desc    Get user profile by ID
// @route   GET /api/profiles/:id
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

// @desc    Upload profile avatar
// @route   POST /api/profiles/avatar
// @access  Private
router.post('/avatar', protect, async (req, res) => {
  try {
    const { avatar } = req.body;
    
    if (!avatar) {
      return res.status(400).json({
        success: false,
        message: 'Avatar URL is required'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: { avatar: user.avatar }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;