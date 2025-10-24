const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

router.get('/stats', auth, getStats);

module.exports = router;