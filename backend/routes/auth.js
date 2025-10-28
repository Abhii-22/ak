const express = require('express');
const router = express.Router();
const { signUp, signIn } = require('../controllers/authController');

// @route   POST api/auth/signup
// @desc    Register a user
// @access  Public
router.post('/signup', signUp);

// @route   POST api/auth/signin
// @desc    Authenticate user & get token
// @access  Public
router.post('/signin', signIn);

module.exports = router;
