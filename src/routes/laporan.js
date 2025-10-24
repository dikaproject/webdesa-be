const router = require('express').Router();
const { getAllLaporan, getLaporanById, getLaporanByIdUser, createLaporan, updateLaporan, deleteLaporan, updateStatusLaporan } = require('../controllers/laporanController');
const { auth, adminOnly, optionalAuth } = require('../middleware/auth');
const { validateLaporan } = require('../middleware/validation');
const upload = require('../config/multer');

// ✅ Public route - guest can create laporan
router.post('/create', optionalAuth, upload.laporan.single('foto'), validateLaporan, createLaporan);

// ✅ Auth required routes
router.get('/user/get/:userId', auth, getLaporanByIdUser);
router.put('/update/:id', auth, upload.laporan.single('foto'), validateLaporan, updateLaporan);

// ✅ Admin only routes
router.get('/getall', auth, adminOnly, getAllLaporan);
router.get('/get/:id', auth, adminOnly, getLaporanById);
router.delete('/delete/:id', auth, adminOnly, deleteLaporan);
router.patch('/status/:id', auth, adminOnly, updateStatusLaporan);

module.exports = router;