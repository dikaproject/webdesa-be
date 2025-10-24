const router = require('express').Router();
const { getAllUmkm, getUmkmById, getUmkmBySlug, createUmkm, updateUmkm, deleteUmkm } = require('../controllers/umkmControler');
const { auth, adminOnly } = require('../middleware/auth');
const { validateUmkm } = require('../middleware/validation');
const upload = require('../config/multer');

router.get('/getall', getAllUmkm);
router.get('/get/:id', getUmkmById);
router.get('/slug/:slug', getUmkmBySlug);
router.post('/create', adminOnly, upload.umkm.single('foto'), validateUmkm, createUmkm);
router.put('/update/:id', adminOnly, upload.umkm.single('foto'), validateUmkm, updateUmkm);
router.delete('/delete/:id', adminOnly, deleteUmkm);


module.exports = router;