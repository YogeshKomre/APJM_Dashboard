require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import User model
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apjm_dashboard')
  .then(async () => {
    console.log('MongoDB Connected');
    
    try {
      // Check if admin user already exists
      const existingAdmin = await User.findOne({ email: 'admin@example.com' });
      
      if (existingAdmin) {
        console.log('Admin user already exists');
        mongoose.disconnect();
        return;
      }
      
      // Create admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true
      });
      
      await adminUser.save();
      console.log('Admin user created successfully');
      
      mongoose.disconnect();
    } catch (err) {
      console.error('Error creating admin user:', err);
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
  });