const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide doctor name'],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, 'Please provide doctor qualification (e.g. BDS, MDS)'],
      trim: true,
    },
    designation: {
      type: String,
      default: 'Senior Dental Consultant',
    },
    specialization: {
      type: [String],
      required: [true, 'Please provide at least one specialization'],
    },
    experienceYears: {
      type: Number,
      required: [true, 'Please provide years of experience'],
      min: 0,
    },
    registrationNumber: {
      type: String,
      trim: true,
      default: '',
    },
    languages: {
      type: [String],
      default: ['English', 'Hindi'],
    },
    about: {
      type: String,
      required: [true, 'Please provide doctor bio/description'],
    },
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    certifications: [String],
    awards: [String],
    memberships: [String],
    consultationFee: {
      type: Number,
      required: [true, 'Please provide consultation fee'],
      min: 0,
      default: 500,
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    availableTimings: {
      start: {
        type: String,
        default: '09:00 AM',
      },
      end: {
        type: String,
        default: '07:00 PM',
      },
      breakStart: {
        type: String,
        default: '01:00 PM',
      },
      breakEnd: {
        type: String,
        default: '02:00 PM',
      },
    },
    slotDurationMinutes: {
      type: Number,
      default: 30,
    },
    photo: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 1,
      max: 5,
    },
    reviewsCount: {
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

module.exports = mongoose.model('Doctor', doctorSchema);
