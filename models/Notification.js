const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'agent',
    required: true
  },
  dialedNumber: {
    type: String,
    required: true
  },
  wrongNumberReason: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('notification', NotificationSchema);