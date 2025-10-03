# APJM Dashboard - Cisco Finesse Call Monitoring System

This web application monitors Cisco Finesse phone system for wrong number dialing and provides notifications on an admin dashboard.

## Features

- Agent monitoring application that integrates with Cisco Finesse
- Detection of wrong number dialing (missing country code, invalid formats)
- Admin dashboard to display notifications with agent details
- Persistent monitoring until agent logout
- Support for Chrome and Edge browsers

## Components

1. **Agent Monitoring Application**: Silently monitors Cisco Finesse for wrong number dialing
2. **Admin Dashboard**: Displays notifications with agent details and dialed numbers

## Setup

1. Clone this repository
2. Install dependencies with `npm install`
3. Configure the Cisco Finesse domain in the `.env` file
4. Start the application with `npm start`
5. Access the agent application at `/agent` and admin dashboard at `/admin`

## Configuration

Edit the `.env` file to set your Cisco Finesse domain:

```
CISCO_FINESSE_DOMAIN=10.190.221.36
```