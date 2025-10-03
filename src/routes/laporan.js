const router = require('express').Router();
const { getAllLaporan, getLaporanById, getLaporanByIdUser, createLaporan, updateLaporan, deleteLaporan, updateStatusLaporan } = require('../controllers/laporanController');
const { auth, adminOnly } = require('../middleware/auth');
const { validateLaporan } = require('../middleware/validation');
const upload = require('../config/multer');

router.get('/user/get/:userId', auth, getLaporanByIdUser);
router.post('/create', auth, upload.laporan.single('foto'), validateLaporan, createLaporan);
router.put('/update/:id', auth, upload.laporan.single('foto'), validateLaporan, updateLaporan);
router.get('/getall', auth, adminOnly, getAllLaporan);
router.get('/get/:id', auth, adminOnly, getLaporanById);
router.delete('/delete/:id', auth, adminOnly, deleteLaporan);
router.patch('/status/:id', auth, adminOnly, updateStatusLaporan);

module.exports = router;