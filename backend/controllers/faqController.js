const FAQ = require('../models/FAQ');

// @desc    Get all active FAQs (filter by category)
// @route   GET /api/faqs
// @access  Public
const getAllFAQs = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
      ];
    }

    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: 1 });

    res.json({
      success: true,
      count: faqs.length,
      faqs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Create FAQ
// @route   POST /api/faqs
// @access  Private/Admin
const createFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      faq,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
const updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.json({
      success: true,
      message: 'FAQ updated successfully',
      faq,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
};
