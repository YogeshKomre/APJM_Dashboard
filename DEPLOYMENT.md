# APJM Dashboard Deployment Guide

## Overview
The APJM Dashboard is a full-stack Cisco Finesse Call Monitoring System with both frontend and backend components.

## Frontend Deployment (GitHub Pages)
The frontend is automatically deployed to GitHub Pages at: https://yogeshkomre.github.io/APJM_Dashboard/

### Frontend Features
- React-based user interface
- Agent monitoring dashboard
- Admin panel
- Real-time notifications display

## Backend Deployment Options

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/YogeshKomre/APJM_Dashboard.git
   cd APJM_Dashboard
   ```

2. Install all dependencies:
   ```bash
   npm run install-all
   ```

3. Create `.env` file with required environment variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/apjm_dashboard
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

4. Start both frontend and backend:
   ```bash
   npm run dev-all
   ```

### Production Deployment

#### Option 1: Heroku
1. Install Heroku CLI
2. Create Heroku app:
   ```bash
   heroku create your-app-name
   ```
3. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   ```
4. Deploy:
   ```bash
   git push heroku master
   ```

#### Option 2: Railway
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

#### Option 3: DigitalOcean App Platform
1. Create new app from GitHub repository
2. Configure environment variables
3. Set build and run commands

## Backend Features

### API Endpoints
- **Authentication**: `/api/auth`
  - POST `/login` - User login
  - POST `/register` - User registration
  - GET `/verify` - Token verification

- **Agents**: `/api/agents`
  - GET `/` - Get all agents
  - POST `/` - Create new agent
  - PUT `/:id` - Update agent
  - DELETE `/:id` - Delete agent

- **Notifications**: `/api/notifications`
  - GET `/` - Get all notifications
  - POST `/` - Create notification
  - PUT `/:id/read` - Mark as read

### Real-time Features
- Socket.IO for live notifications
- Admin room for broadcasting
- Wrong number detection alerts

### Database Schema
- **Users**: Authentication and roles
- **Agents**: Cisco Finesse agent information
- **Notifications**: System alerts and messages

## Environment Variables

| Variable | Description | Required |
|----------|-------------|---------|
| PORT | Server port (default: 5000) | No |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | JWT signing secret | Yes |
| NODE_ENV | Environment (development/production) | Yes |

## Security Considerations
- JWT tokens for authentication
- CORS configuration for cross-origin requests
- Environment variables for sensitive data
- Input validation and sanitization

## Monitoring and Logging
- Console logging for development
- Error handling middleware
- Socket connection tracking

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Verify MONGODB_URI is correct
2. **CORS Issues**: Check frontend URL in CORS configuration
3. **Socket.IO Connection Failed**: Ensure server is running and accessible
4. **Authentication Errors**: Verify JWT_SECRET is set

### Development Tips
- Use `npm run dev-all` for concurrent frontend/backend development
- Check browser console for frontend errors
- Monitor server logs for backend issues
- Use MongoDB Compass for database inspection

## Support
For issues and questions, please create an issue in the GitHub repository.