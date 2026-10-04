const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  createReview,
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllReviews);
router.post('/', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
}, createReview);

// Admin routes
router.get('/admin/all', protect, authorize('ADMIN'), getAdminReviews);
router.put('/admin/:id', protect, authorize('ADMIN'), updateReviewStatus);
router.delete('/admin/:id', protect, authorize('ADMIN'), deleteReview);

module.exports = router;
