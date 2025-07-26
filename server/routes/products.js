const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all products with filtering, sorting, and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(['casual', 'formal', 'evening', 'wedding', 'custom', 'accessories']),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be non-negative'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be non-negative'),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest', 'rating'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sort = 'newest',
      featured
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'price_asc':
        sortObj = { price: 1 };
        break;
      case 'price_desc':
        sortObj = { price: -1 };
        break;
      case 'name_asc':
        sortObj = { name: 1 };
        break;
      case 'name_desc':
        sortObj = { name: -1 };
        break;
      case 'rating':
        sortObj = { 'rating.average': -1 };
        break;
      case 'newest':
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-reviews'), // Exclude reviews for list view
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      message: 'Products retrieved successfully',
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      filters: {
        category,
        minPrice,
        maxPrice,
        search,
        sort,
        featured
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      message: 'Failed to retrieve products',
      error: 'PRODUCTS_FETCH_ERROR'
    });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ 
      isActive: true, 
      featured: true 
    })
    .sort({ createdAt: -1 })
    .limit(8)
    .select('-reviews');

    res.json({
      message: 'Featured products retrieved successfully',
      products
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      message: 'Failed to retrieve featured products',
      error: 'FEATURED_PRODUCTS_ERROR'
    });
  }
});

// Get single product by ID or slug
router.get('/:identifier', optionalAuth, async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by ID first, then by slug
    let product = await Product.findById(identifier);
    if (!product) {
      product = await Product.findOne({ 'seo.slug': identifier });
    }

    if (!product || !product.isActive) {
      return res.status(404).json({
        message: 'Product not found',
        error: 'PRODUCT_NOT_FOUND'
      });
    }

    // Populate reviews with user info
    await product.populate('reviews.user', 'name');

    res.json({
      message: 'Product retrieved successfully',
      product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      message: 'Failed to retrieve product',
      error: 'PRODUCT_FETCH_ERROR'
    });
  }
});

// Create new product (Admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description is required and must be less than 1000 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['casual', 'formal', 'evening', 'wedding', 'custom', 'accessories']).withMessage('Invalid category'),
  body('sizes').isArray({ min: 1 }).withMessage('At least one size is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      message: 'Failed to create product',
      error: 'PRODUCT_CREATE_ERROR'
    });
  }
});

// Update product (Admin only)
router.put('/:id', authenticateToken, requireAdmin, [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ min: 1, max: 1000 }),
  body('price').optional().isFloat({ min: 0 }),
  body('category').optional().isIn(['casual', 'formal', 'evening', 'wedding', 'custom', 'accessories'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        error: 'PRODUCT_NOT_FOUND'
      });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      message: 'Failed to update product',
      error: 'PRODUCT_UPDATE_ERROR'
    });
  }
});

// Delete product (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        error: 'PRODUCT_NOT_FOUND'
      });
    }

    res.json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      message: 'Failed to delete product',
      error: 'PRODUCT_DELETE_ERROR'
    });
  }
});

// Add product review
router.post('/:id/reviews', authenticateToken, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
        error: 'PRODUCT_NOT_FOUND'
      });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        message: 'You have already reviewed this product',
        error: 'REVIEW_EXISTS'
      });
    }

    // Add review
    product.reviews.push({
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment
    });

    // Recalculate average rating
    product.calculateAverageRating();
    await product.save();

    // Populate the new review
    await product.populate('reviews.user', 'name');

    res.status(201).json({
      message: 'Review added successfully',
      review: product.reviews[product.reviews.length - 1]
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      message: 'Failed to add review',
      error: 'REVIEW_ADD_ERROR'
    });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });

    res.json({
      message: 'Categories retrieved successfully',
      categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      message: 'Failed to retrieve categories',
      error: 'CATEGORIES_FETCH_ERROR'
    });
  }
});

module.exports = router;
