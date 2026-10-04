const mongoose = require('mongoose');

const beforeAfterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide treatment case title'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: [
        'Teeth Whitening',
        'Orthodontics / Braces',
        'Dental Implants',
        'Cosmetic Veneers',
        'Composite Bonding',
        'Full Mouth Rehabilitation',
      ],
      default: 'Teeth Whitening',
    },
    beforeImage: {
      type: String,
      required: [true, 'Please provide before image URL'],
    },
    afterImage: {
      type: String,
      required: [true, 'Please provide after image URL'],
    },
    treatmentType: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: '2 weeks',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BeforeAfter', beforeAfterSchema);
