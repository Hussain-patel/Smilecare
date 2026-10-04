const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Helper to convert "09:00 AM" to minutes from midnight
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [time, modifier] = timeStr.trim().split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

// Helper to convert minutes from midnight to "09:00 AM"
const minutesToTime = (totalMinutes) => {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const modifier = hours >= 12 ? 'PM' : 'AM';
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  return `${formattedHours}:${formattedMinutes} ${modifier}`;
};

// Helper to get Day of Week from YYYY-MM-DD
const getDayName = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dateObj.getDay()];
};

const getAvailableSlots = async (doctorId, dateString) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor || !doctor.isActive) {
    throw new Error('Doctor not found or inactive');
  }

  const dayOfWeek = getDayName(dateString);
  if (!doctor.availableDays.includes(dayOfWeek)) {
    return {
      date: dateString,
      day: dayOfWeek,
      isAvailableDay: false,
      message: `${doctor.name} is not available on ${dayOfWeek}s.`,
      slots: [],
    };
  }

  const startTimeMinutes = timeToMinutes(doctor.availableTimings?.start || '09:00 AM');
  const endTimeMinutes = timeToMinutes(doctor.availableTimings?.end || '07:00 PM');
  const breakStartMinutes = timeToMinutes(doctor.availableTimings?.breakStart || '01:00 PM');
  const breakEndMinutes = timeToMinutes(doctor.availableTimings?.breakEnd || '02:00 PM');
  const slotDuration = doctor.slotDurationMinutes || 30;

  // Find all active booked appointments for this doctor on this date
  const existingAppointments = await Appointment.find({
    doctor: doctorId,
    date: dateString,
    status: { $in: ['Pending', 'Confirmed'] },
  }).select('timeSlot');

  const bookedTimeSlots = new Set(existingAppointments.map((app) => app.timeSlot));

  const slots = [];
  for (let current = startTimeMinutes; current + slotDuration <= endTimeMinutes; current += slotDuration) {
    // Check if slot falls in break time
    if (current >= breakStartMinutes && current < breakEndMinutes) {
      continue;
    }

    const slotLabel = minutesToTime(current);
    const isBooked = bookedTimeSlots.has(slotLabel);

    slots.push({
      time: slotLabel,
      isAvailable: !isBooked,
      status: isBooked ? 'Booked' : 'Available',
    });
  }

  return {
    date: dateString,
    day: dayOfWeek,
    isAvailableDay: true,
    doctor: {
      id: doctor._id,
      name: doctor.name,
      qualification: doctor.qualification,
      consultationFee: doctor.consultationFee,
    },
    slots,
  };
};

module.exports = {
  getAvailableSlots,
  timeToMinutes,
  minutesToTime,
};
