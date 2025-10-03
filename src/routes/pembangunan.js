const router = require('express').Router();
const { getAllPembangunan, getPembangunanById, createPembangunan, updatePembangunan, deletePembangunan } = require('../controllers/pembangunanController')
const { auth, adminOnly } = require('../middleware/auth');
const { validateProgramPembangunan } = require('../middleware/validation');
const upload = require('../config/multer');

router.get('/getall', getAllPembangunan);
router.get('/get/:id', getPembangunanById);
router.post('/create', adminOnly, upload.program.single('foto'), validateProgramPembangunan, createPembangunan);
router.put('/update/:id', adminOnly, upload.program.single('foto'), validateProgramPembangunan, updatePembangunan);
router.delete('/delete/:id', adminOnly, deletePembangunan);

module.exports = router;