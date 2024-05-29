const express = require('express');
const { registerUser, loginUser, getuserDashboard } = require('../controller/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router .post('/register', registerUser);
router .post('/login', loginUser);
router .get('/dashboard', protect, getuserDashboard);

module.exports = router;