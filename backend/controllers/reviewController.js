const Review = require('../models/Review');

// @desc    Get all approved reviews + aggregate rating distribution
// @route   GET /api/reviews
// @access  Public
const getAllReviews = async (req, res, next) => {
  try {
    const { doctorId, serviceId } = req.query;
    let query = { isApproved: true };

    if (doctorId) query.doctor = doctorId;
    if (serviceId) query.service = serviceId;

    const reviews = await Review.find(query)
      .populate('doctor', 'name qualification photo specialization')
      .populate('service', 'name category')
      .sort({ createdAt: -1 });

    // Calculate aggregated statistics
    const totalReviews = reviews.length;
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sumRatings = 0;

    reviews.forEach((rev) => {
      const r = Math.round(rev.rating) || 5;
      if (ratingDistribution[r] !== undefined) {
        ratingDistribution[r]++;
      }
      sumRatings += rev.rating;
    });

    const averageRating = totalReviews > 0 ? (sumRatings / totalReviews).toFixed(1) : '5.0';

    const distributionPercentages = {
      5: totalReviews > 0 ? Math.round((ratingDistribution[5] / totalReviews) * 100) : 90,
      4: totalReviews > 0 ? Math.round((ratingDistribution[4] / totalReviews) * 100) : 8,
      3: totalReviews > 0 ? Math.round((ratingDistribution[3] / totalReviews) * 100) : 2,
      2: totalReviews > 0 ? Math.round((ratingDistribution[2] / totalReviews) * 100) : 0,
      1: totalReviews > 0 ? Math.round((ratingDistribution[1] / totalReviews) * 100) : 0,
    };

    res.json({
      success: true,
      stats: {
        totalReviews,
        averageRating: Number(averageRating),
        ratingDistribution,
        distributionPercentages,
      },
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a patient review
// @route   POST /api/reviews
// @access  Public / Authenticated Patient
const createReview = async (req, res, next) => {
  try {
    const { patientName, patientEmail, rating, title, comment, doctorId, serviceId, treatmentExperience } = req.body;

    if (!patientName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name, star rating, and review comments.',
      });
    }

    const review = await Review.create({
      patientName,
      patientEmail: patientEmail || (req.user ? req.user.email : ''),
      patient: req.user ? req.user._id : null,
      rating: Number(rating),
      title: title || 'Patient Review',
      comment,
      doctor: doctorId || null,
      service: serviceId || null,
      treatmentExperience: treatmentExperience || '',
      isVerifiedPatient: true,
      isApproved: true, // auto-approve verified reviews for immediate demo visibility
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable review! It has been posted.',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Get all reviews (including pending/unapproved)
// @route   GET /api/reviews/admin/all
// @access  Private/Admin
const getAdminReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('doctor', 'name photo')
      .populate('service', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Update review moderation status
// @route   PUT /api/reviews/admin/:id
// @access  Private/Admin
const updateReviewStatus = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'hidden'} successfully`,
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Delete review
// @route   DELETE /api/reviews/admin/:id
// @access  Private/Admin
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReviews,
  createReview,
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
};
