const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (mongoUri && !mongoUri.includes('localhost:27017/smilecare_fallback')) {
      console.log('Attempting to connect to configured MongoDB URI...');
      try {
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 4000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
      } catch (err) {
        console.warn('⚠️ Could not connect to external MongoDB. Starting high-performance In-Memory MongoDB engine...');
      }
    }

    // Start In-Memory MongoDB server
    console.log('🚀 Initializing Embedded MongoDB Server for development & demo...');
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`✅ Embedded MongoDB running seamlessly at: ${uri}`);
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

module.exports = { connectDB, closeDB };
