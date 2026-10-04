const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, 'Please provide reviewer name'],
      trim: true,
    },
    patientEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    patientAvatar: {
      type: String,
      default: '',
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      default: null,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      default: null,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide star rating (1-5)'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    comment: {
      type: String,
      required: [true, 'Please write your review feedback'],
    },
    treatmentExperience: {
      type: String,
      default: '',
    },
    isVerifiedPatient: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
