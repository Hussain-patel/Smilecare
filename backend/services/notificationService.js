// Simulated Notification Dispatcher for Email & WhatsApp
const notificationsLog = [];

const sendNotification = async ({ type, recipient, appointment, customMessage }) => {
  const timestamp = new Date().toISOString();
  let emailContent = '';
  let whatsappContent = '';

  const patientName = appointment?.patientInfo?.name || 'Patient';
  const doctorName = appointment?.doctor?.name || 'Dental Specialist';
  const serviceName = appointment?.service?.name || 'Dental Consultation';
  const date = appointment?.date;
  const time = appointment?.timeSlot;
  const appNumber = appointment?.appointmentNumber || 'SC-0000';

  switch (type) {
    case 'BOOKING_RECEIVED':
      emailContent = `Dear ${patientName},\n\nYour appointment request (${appNumber}) for ${serviceName} with ${doctorName} on ${date} at ${time} has been received. Our clinic team will verify the schedule shortly.\n\nWarm regards,\nSmileCare Dental Team`;
      whatsappContent = `🦷 *SmileCare Appointment Received*\nHi ${patientName}! Your booking (${appNumber}) for ${serviceName} on ${date} at ${time} with ${doctorName} has been received. Clinic Contact: +91 98765 43210.`;
      break;

    case 'APPOINTMENT_CONFIRMED':
      emailContent = `Dear ${patientName},\n\nGreat news! Your dental appointment (${appNumber}) with ${doctorName} on ${date} at ${time} is CONFIRMED.\n\nClinic Location: SmileCare Towers, 42 Health Ave, Indiranagar, Bengaluru.\nDirections: https://maps.google.com/?q=12.9784,77.6408\n\nPlease arrive 10 minutes prior to your slot.`;
      whatsappContent = `✅ *SmileCare Appointment Confirmed*\nHi ${patientName}, your appointment (${appNumber}) with ${doctorName} on *${date} at ${time}* is confirmed! Location: SmileCare Towers, Indiranagar. Need help? Call +91 98765 43210.`;
      break;

    case 'APPOINTMENT_CANCELLED':
      emailContent = `Dear ${patientName},\n\nYour appointment (${appNumber}) scheduled for ${date} at ${time} has been cancelled.\nReason: ${customMessage || 'Requested by patient / clinic schedule update'}.\n\nTo re-book, please visit our portal.`;
      whatsappContent = `⚠️ *SmileCare Appointment Cancelled*\nHi ${patientName}, your appointment (${appNumber}) for ${date} has been cancelled. To reschedule, visit our website or WhatsApp us here.`;
      break;

    case 'APPOINTMENT_COMPLETED':
      emailContent = `Dear ${patientName},\n\nThank you for visiting SmileCare today! We hope you had a comfortable experience with ${doctorName}.\nPlease take a moment to share your valuable review with us.`;
      whatsappContent = `🌟 *Thank You for Visiting SmileCare!*\nHi ${patientName}, hope your visit went smoothly! Tap here to rate your experience with ${doctorName}. Keep smiling!`;
      break;

    default:
      emailContent = customMessage || 'SmileCare Notification';
      whatsappContent = customMessage || 'SmileCare Notification';
  }

  const notificationEntry = {
    id: 'NOTIF-' + Date.now(),
    type,
    recipientEmail: appointment?.patientInfo?.email || recipient?.email,
    recipientPhone: appointment?.patientInfo?.phone || recipient?.phone,
    patientName,
    appointmentNumber: appNumber,
    emailSubject: `SmileCare: ${type.replace(/_/g, ' ')}`,
    emailContent,
    whatsappContent,
    status: 'Simulated Delivered',
    sentAt: timestamp,
  };

  notificationsLog.unshift(notificationEntry);
  if (notificationsLog.length > 50) notificationsLog.pop();

  console.log(`📨 [Notification Logged] [${type}] to ${notificationEntry.recipientEmail} | ${notificationEntry.recipientPhone}`);
  return notificationEntry;
};

const getRecentNotifications = () => {
  return notificationsLog;
};

module.exports = {
  sendNotification,
  getRecentNotifications,
};
