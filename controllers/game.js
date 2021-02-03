const { json } = require('body-parser');
const { resolve } = require('path');

const Game = require('../models/Game');
const User = require('../models/User');
const play = require('./play');
const getPseudoById = require('../lib/user/getPseudoById').getPseudoById;
const isInGame = require('../lib/game/isInGame').isInGame

exports.listgames = (req, res, next) => {
    Game.find()    
        .then(games => res.status(200).json(games))
        .catch(error => res.status(400).json({ error }));
}

exports.create = async(req, res, next) => {
    const user = await User.findById(req.body.userId)
    const game = new Game({
        gameType : 'normal game',
        host : {
            id : req.body.userId,
            pseudo : await getPseudoById(req.body.userId),
            actualRank : user.rank,
            newRank : null
        },
        opponent : {
            id : null,
            pseudo: null,
            actualRank : null,
            newRank : null
        },
        moves: [],
        playerTurn: null,
        winner: null,
        messages: [],
        time: {
            host : req.body.time,
            opponent : req.body.time
        },
        afkAdvertisor: 45,
        date: new Date()
    });
    game.save()
        .then(() => {
            res.status(201).json({ game })
        })
        .catch(error => res.status(400).json({ error }));
}

exports.join = (req, res, next) => {
    Game.findById(req.body.gameId)
        .then(async game => {
            if(game.opponent.id){
                res.status(400).json({ error: 'The game is already full' });
            }
            else if(game.host !== req.body.userId){
                Game.updateOne({ _id: game._id}, {
                    'opponent.id': req.body.userId,
                    'opponent.pseudo' : await getPseudoById(req.body.userId),
                })
                    .then(() => {
                        res.status(200).json({ game });
                    })
                    .catch(error => res.status(400).json({ error }));
            }
            else {
                res.status(400).json({ error: 'You cant join your own game' });
            }
        })
        .catch(error => res.status(404).json({ error }));
}

exports.information = (req,res,next) => {
    Game.findById(req.body.gameId)
        .then(game => {
            res.status(200).json({ game });
        })
        .catch(error => res.status(404).json({ error: "game not found" }));
}


//function call when all the condition require to start a game are done
exports.gameStart = (gameId, resolve) => {
    Game.findById(gameId)
    .then(async game => {
        const ranInt = Math.round(Math.random());
        let firstTurnId = null
        if(ranInt === 0) {
            firstTurnId = game.host.id;
        } else {
            firstTurnId = game.opponent.id;
        }
        Game.updateOne({ _id: game._id}, {
            playerTurn: firstTurnId
        }).then(()=>{
            resolve('ok');
        })
    })
}


exports.isInGame = async (req,res,next) => {

    gameInfo = await isInGame(req.body.userId)
    
    if(gameInfo !== false) {
        res.status(200).json({ gameInfo });
    } else {
        res.status(400);
    }
}