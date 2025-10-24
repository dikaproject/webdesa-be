const router = require('express').Router();
const { getAllWisata, getWisataById, getWisataBySlug, createWisata, updateWisata, deleteWisata, getAIRecommendation } = require('../controllers/wisataController');
const { auth, adminOnly } = require('../middleware/auth');
const { validateWisata } = require('../middleware/validation');
const upload = require('../config/multer');

router.get('/getall', getAllWisata);
router.get('/get/:id', getWisataById);
router.get('/slug/:slug', getWisataBySlug);
router.post('/recommend', getAIRecommendation); // AI recommendation endpoint
router.post('/create', adminOnly, upload.wisata.single('foto'), validateWisata, createWisata);
router.put('/update/:id', adminOnly, upload.wisata.single('foto'), validateWisata, updateWisata);
router.delete('/delete/:id', adminOnly, deleteWisata);

module.exports = router;