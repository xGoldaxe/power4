const express = require('express');
const router = express.Router();

const useAuth = require('../middleware/auth')
const matchmakingCtrl = require('../controllers/matchmaking');


router.post('/join', useAuth, matchmakingCtrl.join);


module.exports = router;
