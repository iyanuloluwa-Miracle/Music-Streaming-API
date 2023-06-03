const router = require('express').Router();
const authController = require('../controllers/authController')
const musicController = require('../controllers/musicController')
const authUtils = require('../utils/authUtils')

router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

//Router for User authentication

router.post('/register', authController.register);
// Login a user
router.post('/login', authController.login);
// Logout a user
router.post('/logout', authController.logout);

//Router for music
router.post('/track',musicController.uploadTrack);
router.get('/song/:id',  musicController.playTrack);


module.exports = router;