const express = require('express');
const router = express.Router();
const { getStats, getHomeStats, getPublicStats, getUmkmWisataStats } = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

router.get('/stats', auth, getStats);
router.get('/home-stats', getHomeStats); 
router.get('/public-stats', getPublicStats); 
router.get('/umkm-wisata-stats', getUmkmWisataStats); 

module.exports = router;