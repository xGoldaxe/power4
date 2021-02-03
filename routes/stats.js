const express = require('express');
const router = express.Router();
const statsCtrl = require('../controllers/stats');

router.post('/getStats', statsCtrl.getStats);

module.exports = router;
