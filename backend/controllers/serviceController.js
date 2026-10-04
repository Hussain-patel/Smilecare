const Service = require('../models/Service');

// @desc    Get all active dental services (filter by category, search)
// @route   GET /api/services
// @access  Public
const getAllServices = async (req, res, next) => {
  try {
    const { category, search, popular } = req.query;
    let query = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (popular === 'true') {
      query.isPopular = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const services = await Service.find(query).sort({ isPopular: -1, startingPrice: 1 });

    res.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get service by ID or Slug
// @route   GET /api/services/:idOrSlug
// @access  Public
const getServiceBySlugOrId = async (req, res, next) => {
  try {
    const identifier = req.params.idOrSlug;
    let service;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(identifier);
    } else {
      service = await Service.findOne({ slug: identifier });
    }

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({
      success: true,
      service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new dental service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({
      success: true,
      message: 'Service updated successfully',
      service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllServices,
  getServiceBySlugOrId,
  createService,
  updateService,
  deleteService,
};
