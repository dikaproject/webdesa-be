const router = require('express').Router();
const { getProfileDesa, updateProfileDesa, getStatistikDesa } = require('../controllers/desaController');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../config/multer');


router.get('/profile', getProfileDesa);

router.put('/profile', adminOnly, upload.profileDesa.single('foto'), updateProfileDesa);

router.get('/statistik', getStatistikDesa);

module.exports = router;