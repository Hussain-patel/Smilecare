const Doctor = require('../models/Doctor');
const { getAvailableSlots } = require('../services/slotService');

// @desc    Get all active doctors (filter by specialization or search)
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res, next) => {
  try {
    const { specialization, search } = req.query;
    let query = { isActive: true };

    if (specialization) {
      query.specialization = { $in: [new RegExp(specialization, 'i')] };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { qualification: { $regex: search, $options: 'i' } },
        { specialization: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const doctors = await Doctor.find(query).sort({ rating: -1, experienceYears: -1 });

    res.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({
      success: true,
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get calculated available slots for a doctor on a given date
// @route   GET /api/doctors/:id/slots
// @access  Public
const getDoctorSlots = async (req, res, next) => {
  try {
    const { date } = req.query; // format: YYYY-MM-DD
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a date in YYYY-MM-DD format (e.g. ?date=2026-08-20)',
      });
    }

    const slotData = await getAvailableSlots(req.params.id, date);

    res.json({
      success: true,
      data: slotData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new doctor
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Admin
const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({
      success: true,
      message: 'Doctor profile updated successfully',
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete doctor (or toggle active)
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({
      success: true,
      message: 'Doctor deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorSlots,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
