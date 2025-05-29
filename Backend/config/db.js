const mongoose = require('mongoose');
require('dotenv').config(); 

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI); 
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;