const express = require('express');
const router = express.Router();

const useAuth = require('../middleware/auth')
const gameCtrl = require('../controllers/game');
const gamePlay = require('../controllers/play');


router.get('/listgames', gameCtrl.listgames);
router.post('/create', useAuth, gameCtrl.create);
router.post('/join', useAuth, gameCtrl.join);
router.post('/information', gameCtrl.information);
router.post('/play', useAuth, gamePlay.play);
router.post('/allmoves', gamePlay.allmoves);
router.post('/isingame', gameCtrl.isInGame);






module.exports = router;
