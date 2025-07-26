const express = require('express');
const { body, query, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const CustomRequest = require('../models/CustomRequest');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/custom-requests/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create custom request
router.post('/', optionalAuth, upload.array('inspirationImages', 5), [
  body('contactInfo.name').trim().notEmpty().withMessage('Name is required'),
  body('contactInfo.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('contactInfo.phone').trim().notEmpty().withMessage('Phone is required'),
  body('dressDetails.type').isIn(['wedding', 'evening', 'casual', 'formal', 'party', 'other']).withMessage('Valid dress type is required'),
  body('dressDetails.description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('timeline.preferredDate').optional().isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const requestData = {
      ...req.body,
      user: req.user ? req.user._id : null
    };

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      requestData.inspirationImages = req.files.map(file => ({
        url: `/uploads/custom-requests/${file.filename}`,
        description: `Inspiration image ${file.originalname}`
      }));
    }

    const customRequest = new CustomRequest(requestData);
    await customRequest.save();

    res.status(201).json({
      message: 'Custom request submitted successfully',
      request: customRequest
    });

  } catch (error) {
    console.error('Create custom request error:', error);
    res.status(500).json({
      message: 'Failed to submit custom request',
      error: 'CUSTOM_REQUEST_CREATE_ERROR'
    });
  }
});

// Get user's custom requests
router.get('/my-requests', authenticateToken, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isIn(['submitted', 'reviewing', 'quoted', 'approved', 'in_progress', 'completed', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { page = 1, limit = 10, status } = req.query;
    const filter = { user: req.user._id };
    
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [requests, total] = await Promise.all([
      CustomRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      CustomRequest.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      message: 'Custom requests retrieved successfully',
      requests,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRequests: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get user custom requests error:', error);
    res.status(500).json({
      message: 'Failed to retrieve custom requests',
      error: 'CUSTOM_REQUESTS_FETCH_ERROR'
    });
  }
});

// Get single custom request
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const customRequest = await CustomRequest.findById(req.params.id)
      .populate('user', 'name email')
      .populate('adminResponse.respondedBy', 'name');

    if (!customRequest) {
      return res.status(404).json({
        message: 'Custom request not found',
        error: 'CUSTOM_REQUEST_NOT_FOUND'
      });
    }

    // Check if user owns this request or is admin
    if (customRequest.user && customRequest.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied',
        error: 'ACCESS_DENIED'
      });
    }

    res.json({
      message: 'Custom request retrieved successfully',
      request: customRequest
    });

  } catch (error) {
    console.error('Get custom request error:', error);
    res.status(500).json({
      message: 'Failed to retrieve custom request',
      error: 'CUSTOM_REQUEST_FETCH_ERROR'
    });
  }
});

// Add communication to custom request
router.post('/:id/communications', authenticateToken, [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters')
], upload.array('attachments', 3), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const customRequest = await CustomRequest.findById(req.params.id);
    if (!customRequest) {
      return res.status(404).json({
        message: 'Custom request not found',
        error: 'CUSTOM_REQUEST_NOT_FOUND'
      });
    }

    // Check if user owns this request or is admin
    if (customRequest.user && customRequest.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied',
        error: 'ACCESS_DENIED'
      });
    }

    const communication = {
      from: req.user.role === 'admin' ? 'admin' : 'customer',
      message: req.body.message,
      attachments: []
    };

    // Handle uploaded attachments
    if (req.files && req.files.length > 0) {
      communication.attachments = req.files.map(file => ({
        url: `/uploads/custom-requests/${file.filename}`,
        filename: file.originalname,
        type: file.mimetype
      }));
    }

    customRequest.communications.push(communication);
    await customRequest.save();

    res.status(201).json({
      message: 'Communication added successfully',
      communication: customRequest.communications[customRequest.communications.length - 1]
    });

  } catch (error) {
    console.error('Add communication error:', error);
    res.status(500).json({
      message: 'Failed to add communication',
      error: 'COMMUNICATION_ADD_ERROR'
    });
  }
});

// Update custom request status (Admin only)
router.put('/:id/status', authenticateToken, requireAdmin, [
  body('status').isIn(['submitted', 'reviewing', 'quoted', 'approved', 'in_progress', 'completed', 'cancelled']).withMessage('Valid status is required'),
  body('adminResponse.notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, adminResponse } = req.body;

    const customRequest = await CustomRequest.findById(req.params.id);
    if (!customRequest) {
      return res.status(404).json({
        message: 'Custom request not found',
        error: 'CUSTOM_REQUEST_NOT_FOUND'
      });
    }

    customRequest.status = status;
    
    if (adminResponse) {
      customRequest.adminResponse = {
        ...customRequest.adminResponse,
        ...adminResponse,
        respondedBy: req.user._id,
        respondedAt: new Date()
      };
    }

    await customRequest.save();

    res.json({
      message: 'Custom request updated successfully',
      request: customRequest
    });

  } catch (error) {
    console.error('Update custom request error:', error);
    res.status(500).json({
      message: 'Failed to update custom request',
      error: 'CUSTOM_REQUEST_UPDATE_ERROR'
    });
  }
});

module.exports = router;
