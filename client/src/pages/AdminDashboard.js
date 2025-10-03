import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Paper, Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, AppBar, Toolbar, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [agents, setAgents] = useState([]);
  const { logout } = useContext(AuthContext);

  // Initialize socket connection
  useEffect(() => {
    const socket = io();
    
    // Join admin room to receive notifications
    socket.emit('join_admin_room');
    
    // Listen for new notifications
    socket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    // Fetch existing notifications
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/api/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    // Fetch active agents
    const fetchAgents = async () => {
      try {
        const res = await axios.get('/api/agents');
        setAgents(res.data);
      } catch (err) {
        console.error('Error fetching agents:', err);
      }
    };

    fetchNotifications();
    fetchAgents();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle notification deletion
  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications(notifications.filter(notification => notification._id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard - Wrong Number Monitoring
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          {/* Active Agents */}
          <Paper elevation={3} sx={{ p: 2, flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Active Agents ({agents.filter(agent => agent.isActive).length})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Login ID</TableCell>
                    <TableCell>Extension</TableCell>
                    <TableCell>Last Active</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agents.filter(agent => agent.isActive).map((agent) => (
                    <TableRow key={agent._id}>
                      <TableCell>{agent.name}</TableCell>
                      <TableCell>{agent.loginId}</TableCell>
                      <TableCell>{agent.extension}</TableCell>
                      <TableCell>{formatDate(agent.lastActive)}</TableCell>
                    </TableRow>
                  ))}
                  {agents.filter(agent => agent.isActive).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No active agents</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Wrong Number Notifications */}
          <Paper elevation={3} sx={{ p: 2, flex: 2 }}>
            <Typography variant="h6" gutterBottom>
              Wrong Number Notifications ({notifications.length})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Agent</TableCell>
                    <TableCell>Dialed Number</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification._id}>
                      <TableCell>
                        {notification.agent?.name || 'Unknown'}
                        <Typography variant="caption" display="block">
                          {notification.agent?.loginId || ''}
                        </Typography>
                      </TableCell>
                      <TableCell>{notification.dialedNumber}</TableCell>
                      <TableCell>{notification.wrongNumberReason}</TableCell>
                      <TableCell>{formatDate(notification.date)}</TableCell>
                      <TableCell>
                        <Button 
                          size="small" 
                          color="error" 
                          onClick={() => handleDeleteNotification(notification._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {notifications.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No notifications</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;