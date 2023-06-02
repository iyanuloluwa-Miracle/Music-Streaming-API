const router = require('express').Router();
const authController = require('../controllers/authController')
const musicController = require('../controllers/musicController')


router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

//Router for User authentication
//Router for music authentication
router.post('/register', authController.register);
// Login a user
router.post('/login', authController.login);
// Logout a user



module.exports = router;
