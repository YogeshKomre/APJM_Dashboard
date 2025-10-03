import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Container, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import io from 'socket.io-client';

// Cisco Finesse monitoring script
import { initFinesseMonitoring } from '../utils/finesseMonitor';

const AgentPage = () => {
  const [agent, setAgent] = useState(null);
  const [name, setName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [extension, setExtension] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  // Register agent
  const registerAgent = async (e) => {
    e.preventDefault();
    
    if (!name || !loginId || !extension) {
      setAlert({
        open: true,
        message: 'Please fill in all fields',
        severity: 'error'
      });
      return;
    }

    try {
      const res = await axios.post('/api/agents', { name, loginId, extension });
      setAgent(res.data);
      setIsRegistered(true);
      setAlert({
        open: true,
        message: 'Successfully registered',
        severity: 'success'
      });
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.msg || 'Registration failed',
        severity: 'error'
      });
    }
  };

  // Start monitoring
  const startMonitoring = () => {
    if (!agent) return;

    // Initialize Finesse monitoring
    initFinesseMonitoring({
      agentId: agent._id,
      socket,
      onWrongNumber: (dialedNumber, reason) => {
        // Send notification to server
        axios.post('/api/notifications', {
          agentId: agent._id,
          dialedNumber,
          wrongNumberReason: reason
        });
      }
    });

    setIsMonitoring(true);
    setAlert({
      open: true,
      message: 'Monitoring started',
      severity: 'info'
    });
  };

  // Handle alert close
  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Cisco Finesse Agent Monitor
        </Typography>

        {!isRegistered ? (
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Agent Registration
            </Typography>
            <Box component="form" onSubmit={registerAgent} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Agent Name"
                name="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="loginId"
                label="Cisco Finesse Login ID"
                name="loginId"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="extension"
                label="Extension Number"
                name="extension"
                value={extension}
                onChange={(e) => setExtension(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
            </Box>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Welcome, {agent.name}
            </Typography>
            <Typography variant="body1" paragraph>
              Login ID: {agent.loginId}
            </Typography>
            <Typography variant="body1" paragraph>
              Extension: {agent.extension}
            </Typography>
            
            {!isMonitoring ? (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={startMonitoring}
                sx={{ mt: 2 }}
              >
                Start Monitoring
              </Button>
            ) : (
              <Alert severity="success" sx={{ mt: 2 }}>
                Monitoring is active. You can minimize this window.
              </Alert>
            )}
          </Paper>
        )}
      </Box>

      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AgentPage;