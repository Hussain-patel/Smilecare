const GalleryItem = require('../models/GalleryItem');
const BeforeAfter = require('../models/BeforeAfter');

// @desc    Get all gallery photos (filter by category)
// @route   GET /api/gallery
// @access  Public
const getAllGallery = async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    const items = await GalleryItem.find(query).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Before & After transformation cases
// @route   GET /api/gallery/before-after
// @access  Public
const getBeforeAfter = async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    const cases = await BeforeAfter.find(query)
      .populate('doctor', 'name qualification photo')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: cases.length,
      cases,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Add new gallery photo
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Gallery item added successfully',
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Add Before & After Case
// @route   POST /api/gallery/before-after
// @access  Private/Admin
const createBeforeAfter = async (req, res, next) => {
  try {
    const item = await BeforeAfter.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Before & After case added successfully',
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Delete Before & After Case
// @route   DELETE /api/gallery/before-after/:id
// @access  Private/Admin
const deleteBeforeAfter = async (req, res, next) => {
  try {
    const item = await BeforeAfter.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Before & After case not found' });
    }
    res.json({
      success: true,
      message: 'Before & After case deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllGallery,
  getBeforeAfter,
  createGalleryItem,
  deleteGalleryItem,
  createBeforeAfter,
  deleteBeforeAfter,
};
