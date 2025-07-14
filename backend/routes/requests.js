import express from 'express';
import Request from '../models/Request.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { requestValidation, validateRequest } from '../middleware/validation.js';

const router = express.Router();

// @desc    Send collaboration request
// @route   POST /api/requests
// @access  Private (Investors only)
router.post('/', protect, authorize('investor'), requestValidation, validateRequest, async (req, res) => {
  try {
    const { entrepreneurId, message } = req.body;

    // Check if entrepreneur exists
    const entrepreneur = await User.findById(entrepreneurId);
    if (!entrepreneur || entrepreneur.role !== 'entrepreneur' || !entrepreneur.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Entrepreneur not found'
      });
    }

    // Check if request already exists
    const existingRequest = await Request.findOne({
      investor: req.user.id,
      entrepreneur: entrepreneurId
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Request already sent to this entrepreneur'
      });
    }

    // Create request
    const request = await Request.create({
      investor: req.user.id,
      entrepreneur: entrepreneurId,
      message
    });

    // Populate the request with user details
    await request.populate([
      { path: 'investor', select: 'name avatar company' },
      { path: 'entrepreneur', select: 'name avatar startup' }
    ]);

    // Emit socket event for real-time notification
    if (req.io) {
      req.io.to(entrepreneurId).emit('newRequest', {
        request,
        message: `New collaboration request from ${req.user.name}`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Collaboration request sent successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get user's requests
// @route   GET /api/requests
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    // Build query based on user role
    let query = {};
    if (req.user.role === 'investor') {
      query.investor = req.user.id;
    } else {
      query.entrepreneur = req.user.id;
    }

    if (status && ['pending', 'accepted', 'rejected'].includes(status)) {
      query.status = status;
    }

    const requests = await Request.find(query)
      .populate('investor', 'name avatar company bio')
      .populate('entrepreneur', 'name avatar startup industry')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Request.countDocuments(query);

    res.json({
      success: true,
      data: requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update request status
// @route   PATCH /api/requests/:id
// @access  Private (Entrepreneurs only)
router.patch('/:id', protect, authorize('entrepreneur'), async (req, res) => {
  try {
    const { status, responseMessage } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either accepted or rejected'
      });
    }

    const request = await Request.findOne({
      _id: req.params.id,
      entrepreneur: req.user.id,
      status: 'pending'
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found or already processed'
      });
    }

    // Update request
    request.status = status;
    request.responseMessage = responseMessage;
    request.respondedAt = new Date();
    await request.save();

    // Populate the request
    await request.populate([
      { path: 'investor', select: 'name avatar company' },
      { path: 'entrepreneur', select: 'name avatar startup' }
    ]);

    // Emit socket event for real-time notification
    if (req.io) {
      req.io.to(request.investor._id.toString()).emit('requestUpdate', {
        request,
        message: `Your request was ${status} by ${req.user.name}`
      });
    }

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get request by ID
// @route   GET /api/requests/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('investor', 'name avatar company bio')
      .populate('entrepreneur', 'name avatar startup industry');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is involved in this request
    if (request.investor._id.toString() !== req.user.id && 
        request.entrepreneur._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private (Investors only - can only delete their own pending requests)
router.delete('/:id', protect, authorize('investor'), async (req, res) => {
  try {
    const request = await Request.findOne({
      _id: req.params.id,
      investor: req.user.id,
      status: 'pending'
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found or cannot be deleted'
      });
    }

    await request.deleteOne();

    res.json({
      success: true,
      message: 'Request deleted successfully'
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