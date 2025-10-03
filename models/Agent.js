const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  loginId: {
    type: String,
    required: true,
    unique: true
  },
  extension: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('agent', AgentSchema);