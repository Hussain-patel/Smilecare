const ClinicSetting = require('../models/ClinicSetting');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Service = require('../models/Service');
const User = require('../models/User');
const Review = require('../models/Review');
const Equipment = require('../models/Equipment');
const FAQ = require('../models/FAQ');
const { getRecentNotifications } = require('../services/notificationService');

// Helper to check if clinic is currently Open or Closed
const computeIsOpenNow = (openingHours) => {
  if (!openingHours || openingHours.length === 0) return { isOpen: true, message: 'Open Today' };

  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[now.getDay()];

  const todaySchedule = openingHours.find((h) => h.day === currentDay);
  if (!todaySchedule || todaySchedule.isClosed) {
    return { isOpen: false, statusText: 'Closed Today', message: `Closed on ${currentDay}s` };
  }

  // Convert current time to minutes from midnight
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parseTimeToMins = (tStr) => {
    if (!tStr) return 0;
    const [t, mod] = tStr.trim().split(' ');
    let [h, m] = t.split(':').map(Number);
    if (mod === 'PM' && h < 12) h += 12;
    if (mod === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const openMins = parseTimeToMins(todaySchedule.open || '09:00 AM');
  const closeMins = parseTimeToMins(todaySchedule.close || '08:00 PM');

  if (currentMinutes >= openMins && currentMinutes < closeMins) {
    return {
      isOpen: true,
      statusText: 'Open Now',
      message: `Open today until ${todaySchedule.close}`,
      todaySchedule,
    };
  } else {
    return {
      isOpen: false,
      statusText: 'Closed Now',
      message: `Closed (Opens at ${todaySchedule.open})`,
      todaySchedule,
    };
  }
};

// @desc    Get Clinic profile, settings, status & stats
// @route   GET /api/clinic
// @access  Public
const getClinicSettings = async (req, res, next) => {
  try {
    let settings = await ClinicSetting.findOne();
    if (!settings) {
      settings = await ClinicSetting.create({});
    }

    const openStatus = computeIsOpenNow(settings.openingHours);

    res.json({
      success: true,
      settings,
      openStatus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Update Clinic Settings
// @route   PUT /api/clinic
// @access  Private/Admin
const updateClinicSettings = async (req, res, next) => {
  try {
    let settings = await ClinicSetting.findOne();
    if (!settings) {
      settings = await ClinicSetting.create(req.body);
    } else {
      settings = await ClinicSetting.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.json({
      success: true,
      message: 'Clinic information updated successfully',
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Get aggregated Dashboard Statistics
// @route   GET /api/clinic/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const totalAppointments = await Appointment.countDocuments();
    const todayAppointments = await Appointment.countDocuments({ date: todayStr });
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'Confirmed' });
    const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'Cancelled' });

    const totalPatients = await User.countDocuments({ role: 'PATIENT' });
    const totalDoctors = await Doctor.countDocuments({ isActive: true });
    const totalServices = await Service.countDocuments({ isActive: true });
    const totalReviews = await Review.countDocuments();

    // Total estimated revenue from completed & confirmed appointments
    const revenueAgg = await Appointment.aggregate([
      { $match: { status: { $in: ['Confirmed', 'Completed'] } } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Monthly appointment trend (recent 6 months)
    const recentAppointments = await Appointment.find({
      createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) },
    }).select('createdAt status price');

    // Most popular services
    const servicePopularity = await Appointment.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'serviceDetails',
        },
      },
      { $unwind: '$serviceDetails' },
      {
        $project: {
          name: '$serviceDetails.name',
          category: '$serviceDetails.category',
          count: 1,
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        totalAppointments,
        todayAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        totalPatients,
        totalDoctors,
        totalServices,
        totalReviews,
        totalRevenue,
        servicePopularity,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Global Search across services, doctors, equipment, faqs
// @route   GET /api/clinic/search
// @access  Public
const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.json({ success: true, results: { services: [], doctors: [], equipment: [], faqs: [] } });
    }

    const regex = new RegExp(q.trim(), 'i');

    const [services, doctors, equipment, faqs] = await Promise.all([
      Service.find({
        isActive: true,
        $or: [{ name: regex }, { shortDescription: regex }, { category: regex }],
      }).limit(5),
      Doctor.find({
        isActive: true,
        $or: [{ name: regex }, { qualification: regex }, { specialization: { $in: [regex] } }],
      }).limit(5),
      Equipment.find({
        $or: [{ name: regex }, { purpose: regex }, { category: regex }],
      }).limit(4),
      FAQ.find({
        isActive: true,
        $or: [{ question: regex }, { answer: regex }],
      }).limit(4),
    ]);

    res.json({
      success: true,
      query: q,
      totalResults: services.length + doctors.length + equipment.length + faqs.length,
      results: {
        services,
        doctors,
        equipment,
        faqs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    [Admin] Get notification logs
// @route   GET /api/clinic/admin/notifications
// @access  Private/Admin
const getNotifications = async (req, res, next) => {
  try {
    const notifications = getRecentNotifications();
    res.json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClinicSettings,
  updateClinicSettings,
  getAdminStats,
  globalSearch,
  getNotifications,
};
