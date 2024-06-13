const express = require('express');
const { registerUser, loginUser, updateRoles, getRole, logoutUser } = require('../controller/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', loginUser);
router.post('/register',protect, authorizeRoles('masteradmin'), registerUser);
router.put('/role/:id',protect,authorizeRoles('masteradmin'),updateRoles);
router.get('/role',protect,getRole);
router.post('/logout',protect,logoutUser);

module.exports = router;