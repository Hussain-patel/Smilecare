const express = require('express');
const router = express.Router();
const {
  getClinicSettings,
  updateClinicSettings,
  getAdminStats,
  globalSearch,
  getNotifications,
} = require('../controllers/clinicController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getClinicSettings);
router.get('/search', globalSearch);

// Admin routes
router.put('/', protect, authorize('ADMIN'), updateClinicSettings);
router.get('/admin/stats', protect, authorize('ADMIN'), getAdminStats);
router.get('/admin/notifications', protect, authorize('ADMIN'), getNotifications);

// Image Upload Endpoint
router.post('/upload', protect, authorize('ADMIN'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image file' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'Image uploaded successfully',
    imageUrl: fileUrl,
  });
});

module.exports = router;
