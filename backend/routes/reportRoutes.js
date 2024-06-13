const express = require('express');
const { generateReport } = require('../controller/reportController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

//router.post('/', protect, authorizeRoles('admin', 'masteradmin'), generateReport);
router.post('/', (req, res, next) => {
    //console.log('Report route hit'); //this was done only to check if the route was hit
    next();
}, protect, authorizeRoles('admin', 'masteradmin'), generateReport);

module.exports = router;