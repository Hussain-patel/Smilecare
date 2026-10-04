const express = require('express');
const router = express.Router();
const {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);

// Admin routes
router.post('/', protect, authorize('ADMIN'), createEquipment);
router.put('/:id', protect, authorize('ADMIN'), updateEquipment);
router.delete('/:id', protect, authorize('ADMIN'), deleteEquipment);

module.exports = router;
