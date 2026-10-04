const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const faqRoutes = require('./routes/faqRoutes');
const clinicRoutes = require('./routes/clinicRoutes');

// Auto seed helper
const seedAllData = require('./seeds/seedData');
const Doctor = require('./models/Doctor');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'SmileCare Dental Clinic API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/clinic', clinicRoutes);

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Server & Database
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is freshly started / empty
    const doctorsCount = await Doctor.countDocuments();
    if (doctorsCount === 0) {
      console.log('📦 Database is empty. Seeding initial SmileCare dental clinic data...');
      await seedAllData();
    } else {
      console.log(`✨ Database contains ${doctorsCount} doctors. Ready!`);
    }

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🏥 SmileCare Backend API Server running on port ${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
