const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    appointmentNumber: {
      type: String,
      unique: true,
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // For direct/guest bookings or stored snapshot of patient data
    patientInfo: {
      name: {
        type: String,
        required: [true, 'Patient name is required'],
      },
      email: {
        type: String,
        required: [true, 'Patient email is required'],
      },
      phone: {
        type: String,
        required: [true, 'Patient phone number is required'],
      },
      age: {
        type: Number,
      },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        default: 'Prefer not to say',
      },
      isNewPatient: {
        type: Boolean,
        default: true,
      },
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Please select a doctor'],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Please select a service'],
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Please select appointment date'],
    },
    timeSlot: {
      type: String, // e.g. "10:00 AM"
      required: [true, 'Please select time slot'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Pending',
    },
    reasonForVisit: {
      type: String,
      default: 'General Consultation',
    },
    patientNotes: {
      type: String,
      default: '',
    },
    doctorNotes: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Pay at Clinic (Cash/Card/UPI)', 'Online (Card/UPI/NetBanking)'],
      default: 'Pay at Clinic (Cash/Card/UPI)',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
