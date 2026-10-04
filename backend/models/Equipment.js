const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide machine/equipment name'],
      trim: true,
    },
    brandModel: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      enum: ['Imaging & Diagnostics', 'Treatment & Surgery', 'Sterilization & Safety', 'Patient Comfort', 'Digital Dentistry', 'Cosmetic Dentistry'],
      default: 'Imaging & Diagnostics',
    },
    image: {
      type: String,
      required: [true, 'Please provide equipment image URL'],
    },
    purpose: {
      type: String,
      required: [true, 'Please provide purpose and function'],
    },
    benefits: {
      type: [String],
      default: [],
    },
    patientComfortImpact: {
      type: String,
      default: '',
    },
    yearPurchased: {
      type: Number,
      default: 2023,
    },
    status: {
      type: String,
      enum: ['Active & In-Use', 'Under Maintenance', 'Scheduled Upgrade'],
      default: 'Active & In-Use',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);
