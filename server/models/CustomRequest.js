const mongoose = require('mongoose');

const customRequestSchema = new mongoose.Schema({
  requestNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  dressDetails: {
    type: {
      type: String,
      enum: ['wedding', 'evening', 'casual', 'formal', 'party', 'other'],
      required: true
    },
    occasion: String,
    preferredStyle: String,
    description: {
      type: String,
      required: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    colors: [String],
    materials: [String],
    specialRequirements: String
  },
  measurements: {
    bust: Number,
    waist: Number,
    hips: Number,
    height: Number,
    shoulderWidth: Number,
    armLength: Number,
    dressLength: Number,
    additionalMeasurements: [{
      name: String,
      value: Number,
      unit: {
        type: String,
        enum: ['cm', 'inches'],
        default: 'cm'
      }
    }]
  },
  budget: {
    min: {
      type: Number,
      min: [0, 'Budget cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Budget cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  timeline: {
    preferredDate: Date,
    isFlexible: {
      type: Boolean,
      default: true
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    }
  },
  inspirationImages: [{
    url: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['submitted', 'reviewing', 'quoted', 'approved', 'in_progress', 'completed', 'cancelled'],
    default: 'submitted'
  },
  adminResponse: {
    quote: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD'
      },
      breakdown: [{
        item: String,
        cost: Number
      }]
    },
    estimatedCompletion: Date,
    notes: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  communications: [{
    from: {
      type: String,
      enum: ['customer', 'admin'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    attachments: [{
      url: String,
      filename: String,
      type: String
    }],
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: [String]
}, {
  timestamps: true
});

// Generate request number before saving
customRequestSchema.pre('save', async function(next) {
  if (!this.requestNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Find the last request of the month
    const lastRequest = await this.constructor.findOne({
      requestNumber: new RegExp(`^CR${year}${month}`)
    }).sort({ requestNumber: -1 });
    
    let sequence = 1;
    if (lastRequest) {
      const lastSequence = parseInt(lastRequest.requestNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.requestNumber = `CR${year}${month}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Add communication when status changes
customRequestSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.communications.push({
      from: 'admin',
      message: `Status updated to: ${this.status}`,
      timestamp: new Date()
    });
  }
  next();
});

// Calculate days since submission
customRequestSchema.virtual('daysSinceSubmission').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Check if request is overdue
customRequestSchema.virtual('isOverdue').get(function() {
  if (!this.timeline.preferredDate) return false;
  return new Date() > this.timeline.preferredDate && this.status !== 'completed';
});

// Ensure virtual fields are serialized
customRequestSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('CustomRequest', customRequestSchema);
