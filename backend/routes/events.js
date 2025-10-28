const express = require('express');
const router = express.Router();
const { createEvent, getEvents } = require('../controllers/eventController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST api/events
// @desc    Create an event
// @access  Private
router.post('/', [auth, upload.single('eventImage')], createEvent);

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', getEvents);

module.exports = router;
