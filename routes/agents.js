const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Import Agent model (will create later)
const Agent = require('../models/Agent');

// @route   GET api/agents
// @desc    Get all agents
// @access  Private/Admin
router.get('/', auth, async (req, res) => {
  try {
    // Only allow admins to access this route
    if (!req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized as admin' });
    }
    
    const agents = await Agent.find().sort({ date: -1 });
    res.json(agents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/agents
// @desc    Register an agent
// @access  Public
router.post('/', async (req, res) => {
  const { name, loginId, extension } = req.body;

  try {
    // Check if agent already exists
    let agent = await Agent.findOne({ loginId });

    if (agent) {
      // Update last active time
      agent.lastActive = Date.now();
      agent.isActive = true;
      await agent.save();
      return res.json(agent);
    }

    // Create new agent
    agent = new Agent({
      name,
      loginId,
      extension,
      isActive: true,
      lastActive: Date.now()
    });

    await agent.save();
    res.json(agent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/agents/:id/status
// @desc    Update agent status (active/inactive)
// @access  Public
router.put('/:id/status', async (req, res) => {
  const { isActive } = req.body;

  try {
    let agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ msg: 'Agent not found' });
    }

    agent.isActive = isActive;
    if (isActive) {
      agent.lastActive = Date.now();
    }

    await agent.save();
    res.json(agent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;