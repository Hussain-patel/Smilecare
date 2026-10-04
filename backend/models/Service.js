const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide service name'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide service category'],
      enum: [
        'Preventive Dentistry',
        'Cosmetic Dentistry',
        'Restorative Dentistry',
        'Orthodontics',
        'Endodontics',
        'Periodontics',
        'Oral Surgery',
        'Pediatric Dentistry',
        'Emergency Care',
      ],
      default: 'Preventive Dentistry',
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide a short description'],
    },
    fullDescription: {
      type: String,
      required: [true, 'Please provide full treatment details'],
    },
    startingPrice: {
      type: Number,
      required: [true, 'Please provide starting price'],
      min: 0,
    },
    durationMinutes: {
      type: String,
      default: '30-45 min',
    },
    visitsRequired: {
      type: String,
      default: '1-2 visits',
    },
    benefits: [String],
    procedureSteps: [
      {
        stepNumber: Number,
        title: String,
        description: String,
      },
    ],
    image: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'Sparkles',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug before saving if not provided
serviceSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
