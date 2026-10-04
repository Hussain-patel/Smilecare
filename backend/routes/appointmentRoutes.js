const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  rescheduleAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

// Public / Guest or Logged in creation
router.post('/', (req, res, next) => {
  // Optional auth header check: if present, populate req.user, else continue as guest
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
}, createAppointment);

// Patient appointments
router.get('/my-appointments', protect, getMyAppointments);
router.get('/:idOrNumber', getAppointmentById);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/reschedule', rescheduleAppointment);

// Admin appointments
router.get('/admin/all', protect, authorize('ADMIN'), getAllAppointments);
router.put('/admin/:id/status', protect, authorize('ADMIN'), updateAppointmentStatus);

module.exports = router;
