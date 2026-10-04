const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServiceBySlugOrId,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllServices);
router.get('/:idOrSlug', getServiceBySlugOrId);

// Admin protected routes
router.post('/', protect, authorize('ADMIN'), createService);
router.put('/:id', protect, authorize('ADMIN'), updateService);
router.delete('/:id', protect, authorize('ADMIN'), deleteService);

module.exports = router;
