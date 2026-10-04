const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide image title'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: [
        'Clinic Exterior',
        'Reception & Lounge',
        'Treatment Rooms',
        'Sterilization Area',
        'Dental Equipment',
        'Doctors & Staff',
        'Pediatric Corner',
        'Clinic Events',
      ],
      default: 'Treatment Rooms',
    },
    image: {
      type: String,
      required: [true, 'Please provide image URL'],
    },
    caption: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
