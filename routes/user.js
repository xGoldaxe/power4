const express = require('express');
const router = express.Router();

const useAuth = require('../middleware/auth')
const userCtrl = require('../controllers/user');

router.post('/useAuth', useAuth);
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/informationuser', userCtrl.information);
router.post('/informationpseudo', userCtrl.informationpseudo);
router.post('/verifyUser', useAuth);

module.exports = router;
