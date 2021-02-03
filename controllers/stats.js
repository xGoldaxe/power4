const { response } = require('express');
const Game = require('../models/Game');
const User = require('../models/User');
const userFunc = require('./user')

exports.getStats = async (req,res, next) => {
    const historic = await Game.find({//host or opponenet = userId => winner !== null
        $or:[{'host.id' : req.body.userId },{'opponent.id' : req.body.userId }],
        $nor: [{winner : null}]
    })
    let stats = {
        games: 0,
        wins: 0,
        loses: 0,
        draws: 0
    }
    historic.forEach(x => {
        stats.games ++
        if(x.winner === req.body.userId) {
            stats.wins ++
        } else if (x.winner === 'draw') {
            stats.draws ++
        } else {
            stats.loses ++
        }
    })
    res.status(200).json({stats})
}
