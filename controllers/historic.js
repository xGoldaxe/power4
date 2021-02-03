const { response } = require('express');
const Game = require('../models/Game');
const User = require('../models/User');
const userFunc = require('./user')

exports.getGames = async (req,res, next) => {
    const historic = await Game.find({//host or opponenet = userId => winner !== null
        $or:[{'host.id' : req.body.userId.id },{'opponent.id' : req.body.userId.id }],
        $nor: [{winner : null}]
    }).limit(30)
    res.status(200).json({ historic })
}
