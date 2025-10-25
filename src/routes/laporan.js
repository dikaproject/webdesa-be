const router = require('express').Router();
const { getAllLaporan, getLaporanById, getLaporanByIdUser, createLaporan, updateLaporan, deleteLaporan, updateStatusLaporan, validateLaporanBeforeSubmit } = require('../controllers/laporanController');
const { auth, adminOnly, optionalAuth } = require('../middleware/auth');
const { validateLaporan } = require('../middleware/validation');
const upload = require('../config/multer');

router.post('/validate', optionalAuth, upload.laporan.single('foto'), validateLaporanBeforeSubmit);

router.post('/create', optionalAuth, upload.laporan.single('foto'), validateLaporan, createLaporan);

router.get('/user/get/:userId', auth, getLaporanByIdUser);
router.put('/update/:id', auth, upload.laporan.single('foto'), validateLaporan, updateLaporan);

router.get('/getall', auth, adminOnly, getAllLaporan);
router.get('/get/:id', auth, adminOnly, getLaporanById);
router.delete('/delete/:id', auth, adminOnly, deleteLaporan);
router.patch('/status/:id', auth, adminOnly, updateStatusLaporan);

module.exports = router;