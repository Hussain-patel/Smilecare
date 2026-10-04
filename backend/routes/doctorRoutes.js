const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  getDoctorSlots,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/slots', getDoctorSlots);

// Admin protected routes
router.post('/', protect, authorize('ADMIN'), createDoctor);
router.put('/:id', protect, authorize('ADMIN'), updateDoctor);
router.delete('/:id', protect, authorize('ADMIN'), deleteDoctor);

module.exports = router;
