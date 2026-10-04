const express = require('express');
const router = express.Router();
const {
  getAllGallery,
  getBeforeAfter,
  createGalleryItem,
  deleteGalleryItem,
  createBeforeAfter,
  deleteBeforeAfter,
} = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllGallery);
router.get('/before-after', getBeforeAfter);

// Admin routes
router.post('/', protect, authorize('ADMIN'), createGalleryItem);
router.delete('/:id', protect, authorize('ADMIN'), deleteGalleryItem);
router.post('/before-after', protect, authorize('ADMIN'), createBeforeAfter);
router.delete('/before-after/:id', protect, authorize('ADMIN'), deleteBeforeAfter);

module.exports = router;
