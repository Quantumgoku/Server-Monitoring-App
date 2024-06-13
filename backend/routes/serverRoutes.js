const express = require('express');
const { addServer, deleteServer, getServers, getServerStatus  } = require('../controller/serverController');
const { protect,authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, authorizeRoles('admin', 'masteradmin'), addServer);
router.delete('/:id',protect, authorizeRoles('admin', 'masteradmin'), deleteServer);
router.get('/',protect, getServers);
router.get('/status/:ip', protect, getServerStatus);

module.exports = router;