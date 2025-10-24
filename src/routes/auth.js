const router = require('express').Router();
const { register, login, getProfile } = require('../controllers/authController');
const { validateRegister } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

router.post('/register', validateRegister, register);
router.post('/login', login);
router.get('/me', auth, getProfile);
router.get('/profile', auth, getProfile);

module.exports = router;