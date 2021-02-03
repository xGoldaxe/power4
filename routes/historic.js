const express = require('express');
const router = express.Router();
const historic = require('../controllers/historic');

router.post('/getGames', historic.getGames);

module.exports = router;
