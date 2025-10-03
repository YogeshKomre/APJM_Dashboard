# APJM Dashboard - Setup Guide

This document provides detailed instructions for setting up and running the APJM Dashboard application.

## Prerequisites

1. Node.js (v14 or higher)
2. npm (v6 or higher)
3. MongoDB (optional, for persistent storage)

## Installation

### 1. Install Dependencies

From the root directory, run:

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

Alternatively, you can use the script:

```bash
npm run install-all
```

### 2. Configure Environment Variables

Edit the `.env` file in the root directory:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# Cisco Finesse Configuration
CISCO_FINESSE_DOMAIN=10.190.221.36

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# MongoDB Connection (optional)
# MONGODB_URI=mongodb://localhost:27017/apjm_dashboard
```

### 3. Create Admin User

Before starting the application, you need to create an admin user. Run the following script:

```bash
node scripts/create-admin.js
```

This will create an admin user with the following credentials:

- Email: admin@example.com
- Password: admin123

**Important:** Change these credentials after first login for security.

## Running the Application

### Development Mode

To run both the server and client in development mode:

```bash
npm run dev-all
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

### Production Mode

To build the client for production and run the server:

```bash
# Build the client
npm run build

# Start the server
npm start
```

The application will be available at http://localhost:5000

## Accessing the Application

1. **Agent Interface**: http://localhost:3000/agent (development) or http://localhost:5000/agent (production)
2. **Admin Dashboard**: http://localhost:3000/admin (development) or http://localhost:5000/admin (production)

## Creating the Admin User Script

Create a file at `scripts/create-admin.js` with the following content:

```javascript
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
```

## Troubleshooting

### MongoDB Connection Issues

If you're using MongoDB and encounter connection issues:

1. Ensure MongoDB is running on your system
2. Check the connection string in the `.env` file
3. If using a remote MongoDB instance, ensure network access is configured correctly

### Cisco Finesse Integration

The application is configured to work with the Cisco Finesse domain at `10.190.221.36`. If your Finesse domain is different:

1. Update the `CISCO_FINESSE_DOMAIN` in the `.env` file
2. Ensure the agent's browser can access the Finesse domain

### Browser Compatibility

The application is designed to work with Chrome and Edge browsers. If you encounter issues:

1. Ensure you're using the latest version of Chrome or Edge
2. Check browser console for any JavaScript errors
3. Ensure browser extensions aren't blocking the application's functionality