const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Service = require('../models/Service');
const { sendNotification } = require('../services/notificationService');

// Helper to generate appointment number (e.g. SC-2026-8742)
const generateAppointmentNumber = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `SC-${year}-${randomNum}`;
};

// @desc    Create / Book a new appointment
// @route   POST /api/appointments
// @access  Public (Guest) or Authenticated Patient
const createAppointment = async (req, res, next) => {
  try {
    const {
      doctorId,
      serviceId,
      date,
      timeSlot,
      patientInfo,
      reasonForVisit,
      patientNotes,
      paymentMethod,
    } = req.body;

    if (!doctorId || !serviceId || !date || !timeSlot || !patientInfo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required appointment fields (doctor, service, date, time slot, patient info).',
      });
    }

    // Verify Doctor and Service exist
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ success: false, message: 'Selected doctor is not available.' });
    }

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ success: false, message: 'Selected dental service not found.' });
    }

    // Check for double booking conflict
    const existingConflict = await Appointment.findOne({
      doctor: doctorId,
      date,
      timeSlot,
      status: { $in: ['Pending', 'Confirmed'] },
    });

    if (existingConflict) {
      return res.status(409).json({
        success: false,
        message: `The time slot ${timeSlot} on ${date} for Dr. ${doctor.name} has just been booked by another patient. Please choose a different time slot.`,
      });
    }

    const appointmentNumber = generateAppointmentNumber();
    const price = service.startingPrice || doctor.consultationFee || 500;

    const appointment = await Appointment.create({
      appointmentNumber,
      patient: req.user ? req.user._id : null,
      patientInfo: {
        name: patientInfo.name,
        email: patientInfo.email.toLowerCase(),
        phone: patientInfo.phone,
        age: patientInfo.age,
        gender: patientInfo.gender,
        isNewPatient: patientInfo.isNewPatient !== undefined ? patientInfo.isNewPatient : true,
      },
      doctor: doctorId,
      service: serviceId,
      date,
      timeSlot,
      reasonForVisit: reasonForVisit || service.name,
      patientNotes: patientNotes || '',
      price,
      paymentMethod: paymentMethod || 'Pay at Clinic (Cash/Card/UPI)',
      paymentStatus: paymentMethod?.includes('Online') ? 'Paid' : 'Pending',
      status: 'Confirmed', // Instant auto-confirmation for modern UX
    });

    // Populate for response & notification
    await appointment.populate([
      { path: 'doctor', select: 'name qualification specialization consultationFee photo phone' },
      { path: 'service', select: 'name category startingPrice durationMinutes' },
    ]);

    // Send Simulated Notification
    await sendNotification({
      type: 'APPOINTMENT_CONFIRMED',
      appointment,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment confirmed successfully!',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments for the logged-in patient
// @route   GET /api/appointments/my-appointments
// @access  Private (Patient)
const getMyAppointments = async (req, res, next) => {
  try {
    const userEmail = req.user.email.toLowerCase();
    
    // Find by user ID or user email
    const appointments = await Appointment.find({
      $or: [{ patient: req.user._id }, { 'patientInfo.email': userEmail }],
    })
      .populate('doctor', 'name qualification specialization photo phone consultationFee')
      .populate('service', 'name category startingPrice durationMinutes icon')
      .sort({ date: -1, createdAt: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single appointment by ID or AppointmentNumber
// @route   GET /api/appointments/:idOrNumber
// @access  Public (with appointmentNumber) or Authenticated
const getAppointmentById = async (req, res, next) => {
  try {
    const { idOrNumber } = req.params;
    let appointment;

    if (idOrNumber.match(/^[0-9a-fA-F]{24}$/)) {
      appointment = await Appointment.findById(idOrNumber);
    } else {
      appointment = await Appointment.findOne({ appointmentNumber: idOrNumber });
    }

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    await appointment.populate([
      { path: 'doctor', select: 'name qualification specialization photo phone consultationFee availableTimings' },
      { path: 'service', select: 'name category startingPrice durationMinutes icon benefits' },
    ]);

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private / Public (with matching details)
const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const appointment = await Appointment.findById(id)
      .populate('doctor', 'name photo phone')
      .populate('service', 'name startingPrice');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Appointment is already cancelled' });
    }

    appointment.status = 'Cancelled';
    appointment.cancellationReason = cancellationReason || 'Cancelled by patient';
    await appointment.save();

    // Send Cancellation Notification
    await sendNotification({
      type: 'APPOINTMENT_CANCELLED',
      appointment,
      customMessage: appointment.cancellationReason,
    });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully.',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private / Public
const rescheduleAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, timeSlot } = req.body;

    if (!date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new date and time slot.',
      });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Check conflict on new date/slot
    const existingConflict = await Appointment.findOne({
      _id: { $ne: id },
      doctor: appointment.doctor,
      date,
      timeSlot,
      status: { $in: ['Pending', 'Confirmed'] },
    });

    if (existingConflict) {
      return res.status(409).json({
        success: false,
        message: `The time slot ${timeSlot} on ${date} is already booked. Please choose another slot.`,
      });
    }

    appointment.date = date;
    appointment.timeSlot = timeSlot;
    appointment.status = 'Confirmed';
    await appointment.save();

    await appointment.populate([
      { path: 'doctor', select: 'name photo phone' },
      { path: 'service', select: 'name startingPrice' },
    ]);

    await sendNotification({
      type: 'APPOINTMENT_CONFIRMED',
      appointment,
      customMessage: 'Your appointment has been successfully rescheduled.',
    });

    res.json({
      success: true,
      message: 'Appointment rescheduled successfully!',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Get all appointments with filtering & pagination
// @route   GET /api/appointments/admin/all
// @access  Private/Admin
const getAllAppointments = async (req, res, next) => {
  try {
    const { doctorId, status, date, search, page = 1, limit = 50 } = req.query;
    let query = {};

    if (doctorId && doctorId !== 'All') {
      query.doctor = doctorId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (date) {
      query.date = date;
    }

    if (search) {
      query.$or = [
        { appointmentNumber: { $regex: search, $options: 'i' } },
        { 'patientInfo.name': { $regex: search, $options: 'i' } },
        { 'patientInfo.email': { $regex: search, $options: 'i' } },
        { 'patientInfo.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const count = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate('doctor', 'name qualification photo specialization')
      .populate('service', 'name category startingPrice')
      .sort({ date: -1, timeSlot: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Update appointment status & notes
// @route   PUT /api/appointments/admin/:id/status
// @access  Private/Admin
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, doctorNotes, paymentStatus } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor', 'name photo phone')
      .populate('service', 'name startingPrice');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (status) appointment.status = status;
    if (doctorNotes !== undefined) appointment.doctorNotes = doctorNotes;
    if (paymentStatus) appointment.paymentStatus = paymentStatus;

    await appointment.save();

    if (status === 'Confirmed') {
      await sendNotification({ type: 'APPOINTMENT_CONFIRMED', appointment });
    } else if (status === 'Completed') {
      await sendNotification({ type: 'APPOINTMENT_COMPLETED', appointment });
    } else if (status === 'Cancelled') {
      await sendNotification({ type: 'APPOINTMENT_CANCELLED', appointment, customMessage: 'Cancelled by clinic admin' });
    }

    res.json({
      success: true,
      message: `Appointment status updated to ${status}`,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  rescheduleAppointment,
  getAllAppointments,
  updateAppointmentStatus,
};
