const express = require('express');
const router = express.Router();
const {
  getAllFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} = require('../controllers/faqController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllFAQs);

// Admin routes
router.post('/', protect, authorize('ADMIN'), createFAQ);
router.put('/:id', protect, authorize('ADMIN'), updateFAQ);
router.delete('/:id', protect, authorize('ADMIN'), deleteFAQ);

module.exports = router;
