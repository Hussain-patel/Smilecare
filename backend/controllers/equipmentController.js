const Equipment = require('../models/Equipment');

// @desc    Get all dental machines and equipment
// @route   GET /api/equipment
// @access  Public
const getAllEquipment = async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    const equipment = await Equipment.find(query).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: equipment.length,
      equipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single equipment
// @route   GET /api/equipment/:id
// @access  Public
const getEquipmentById = async (req, res, next) => {
  try {
    const item = await Equipment.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    res.json({
      success: true,
      equipment: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Create Equipment
// @route   POST /api/equipment
// @access  Private/Admin
const createEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Equipment item added successfully',
      equipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Update Equipment
// @route   PUT /api/equipment/:id
// @access  Private/Admin
const updateEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    res.json({
      success: true,
      message: 'Equipment updated successfully',
      equipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Delete Equipment
// @route   DELETE /api/equipment/:id
// @access  Private/Admin
const deleteEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return res.status(404).json({ success: false, message: 'Equipment not found' });
    }
    res.json({
      success: true,
      message: 'Equipment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};
