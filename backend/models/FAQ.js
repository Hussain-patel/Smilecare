const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Please provide question text'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Please provide answer text'],
    },
    category: {
      type: String,
      enum: ['General & Appointments', 'Treatments & Procedures', 'Pricing & Insurance', 'Emergency Care', 'Post-Treatment Care'],
      default: 'General & Appointments',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FAQ', faqSchema);
