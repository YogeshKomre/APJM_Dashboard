const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Import Notification model (will create later)
const Notification = require('../models/Notification');

// @route   GET api/notifications
// @desc    Get all notifications
// @access  Private/Admin
router.get('/', auth, async (req, res) => {
  try {
    // Only allow admins to access this route
    if (!req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized as admin' });
    }
    
    const notifications = await Notification.find()
      .sort({ date: -1 })
      .populate('agent', 'name loginId extension');
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/notifications
// @desc    Create a notification
// @access  Public
router.post('/', async (req, res) => {
  const { agentId, dialedNumber, wrongNumberReason } = req.body;

  try {
    const notification = new Notification({
      agent: agentId,
      dialedNumber,
      wrongNumberReason
    });

    await notification.save();

    // Populate agent details for the response
    const populatedNotification = await Notification.findById(notification._id)
      .populate('agent', 'name loginId extension');

    // Emit socket event (handled in server.js)
    const { io } = require('../server');
    io.to('admin_room').emit('notification', populatedNotification);

    res.json(populatedNotification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/notifications/:id
// @desc    Delete a notification
// @access  Private/Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    // Only allow admins to access this route
    if (!req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized as admin' });
    }

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    await notification.remove();

    res.json({ msg: 'Notification removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;