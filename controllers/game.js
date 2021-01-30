const { json } = require('body-parser');
const { resolve } = require('path');

const Game = require('../models/Game');
const play = require('./play');


exports.listgames = (req, res, next) => {
    Game.find()    
        .then(games => res.status(200).json(games))
        .catch(error => res.status(400).json({ error }));
}

exports.create = (req, res, next) => {
    const game = new Game({
        gameType : 'normal game',
        host : req.body.userId,
        opponent : null,
        moves: [],
        playerTurn: null,
        winner: null,
        messages: [],
        time: {
            host : req.body.time,
            opponent : req.body.time
        },
        afkAdvertisor: 45
    });
    game.save()
        .then(() => {
            res.status(201).json({ game })
        })
        .catch(error => res.status(400).json({ error }));
}

exports.join = (req, res, next) => {
    Game.findById(req.body.gameId)
        .then(game => {
            if(game.opponent){
                res.status(400).json({ error: 'The game is already full' });
            }
            else if(game.host !== req.body.userId){
                Game.updateOne({ _id: game._id}, {
                    opponent: req.body.userId
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
            firstTurnId = game.host;
        } else {
            firstTurnId = game.opponent;
        }
        Game.updateOne({ _id: game._id}, {
            playerTurn: firstTurnId
        }).then(()=>{
            console.log('well updated');
            resolve('ok');
        })
    })
}
