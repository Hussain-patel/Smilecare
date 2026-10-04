const mongoose = require('mongoose');

const clinicSettingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'SmileCare Premium Dental Clinic & Implant Center',
    },
    shortName: {
      type: String,
      default: 'SmileCare Dental',
    },
    tagline: {
      type: String,
      default: 'Your Smile. Our Expertise.',
    },
    heroSubtitle: {
      type: String,
      default: 'Professional dental care with advanced 3D technology, seasoned specialists, and pain-free personalized treatments.',
    },
    aboutDescription: {
      type: String,
      default: 'SmileCare provides comprehensive, state-of-the-art dental care with precision equipment, international sterilization protocols, and compassionate doctors dedicated to your lifelong dental health.',
    },
    establishedYear: {
      type: Number,
      default: 2014,
    },
    mission: {
      type: String,
      default: 'To provide world-class, gentle, and accessible dental healthcare utilizing advanced digital diagnostics and evidence-based clinical practices.',
    },
    vision: {
      type: String,
      default: 'To be the most trusted healthcare sanctuary for smiles, setting the gold standard in patient comfort, safety, and aesthetic transformation.',
    },
    values: {
      type: [String],
      default: [
        'Patient-First Compassion',
        'Zero-Compromise Sterilization',
        'Transparent & Honest Pricing',
        'Continuous Digital Innovation',
        'Pain-Free Care Philosophy',
      ],
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
    emergencyPhone: {
      type: String,
      default: '+91 98765 00911',
    },
    email: {
      type: String,
      default: 'care@smilecaredental.com',
    },
    whatsapp: {
      type: String,
      default: '+919876543210',
    },
    address: {
      building: { type: String, default: 'SmileCare Towers, 2nd Floor' },
      street: { type: String, default: '42 Health Avenue, Metro Pillar 128' },
      area: { type: String, default: 'Indiranagar' },
      city: { type: String, default: 'Bengaluru' },
      state: { type: String, default: 'Karnataka' },
      pinCode: { type: String, default: '560038' },
      country: { type: String, default: 'India' },
      landmark: { type: String, default: 'Opposite Central Park Metro Station' },
    },
    coordinates: {
      lat: { type: Number, default: 12.9784 },
      lng: { type: Number, default: 77.6408 },
    },
    googleMapsEmbedUrl: {
      type: String,
      default: 'https://maps.google.com/maps?q=12.9784,77.6408&z=15&output=embed',
    },
    openingHours: [
      {
        day: { type: String, required: true },
        open: { type: String, default: '09:00 AM' },
        close: { type: String, default: '08:00 PM' },
        isClosed: { type: Boolean, default: false },
      },
    ],
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/smilecaredental' },
      facebook: { type: String, default: 'https://facebook.com/smilecaredental' },
      youtube: { type: String, default: 'https://youtube.com/@smilecaredental' },
      linkedin: { type: String, default: 'https://linkedin.com/company/smilecare-dental' },
      twitter: { type: String, default: 'https://twitter.com/smilecaredental' },
    },
    stats: {
      rating: { type: Number, default: 4.9 },
      reviewsCount: { type: Number, default: 1280 },
      experienceYears: { type: Number, default: 12 },
      patientsServed: { type: String, default: '15,000+' },
      treatmentsCount: { type: String, default: '25+' },
      doctorsCount: { type: Number, default: 6 },
    },
    nearbyAmenities: [
      {
        category: { type: String, default: 'Metro Station' },
        name: { type: String, default: 'Indiranagar Metro (Purple Line)' },
        distance: { type: String, default: '150 meters (2 min walk)' },
      },
      {
        category: { type: String, default: 'Parking' },
        name: { type: String, default: 'Free Dedicated Clinic Valet & Basement' },
        distance: { type: String, default: 'On-site' },
      },
      {
        category: { type: String, default: 'Pharmacy' },
        name: { type: String, default: 'Apollo 24/7 Pharmacy' },
        distance: { type: String, default: 'Ground Floor' },
      },
      {
        category: { type: String, default: 'Hospital' },
        name: { type: String, default: 'City Multi-Specialty Hospital' },
        distance: { type: String, default: '500 meters' },
      },
    ],
    emergencyCareEnabled: {
      type: Boolean,
      default: true,
    },
    disclaimer: {
      type: String,
      default: 'Information provided on this platform is for educational and appointment coordination purposes. Final diagnosis and pricing will be determined post comprehensive in-person examination by our certified dental surgeons.',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClinicSetting', clinicSettingSchema);
