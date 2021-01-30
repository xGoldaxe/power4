const { json } = require('body-parser');
const { table } = require('console');


const Game = require('../models/Game');
const gameAction = require('../lib/game/game');
const win = require('../lib/game/iswin');

exports.play = (req, res, next) => {
    Game.findById(req.body.gameId)
        .then(game => {
            //test if the player has the right to play
            if(req.body.userId === game.playerTurn && game.winner === null){
                const movePlayed = gameAction.createMove(req, game);
                const nextTurnValue = gameAction.swapTurn(game);
                const isWin = win.isWin(game.moves, movePlayed , game.playerTurn)
                let winner = null;
                if(isWin) {
                    winner = req.body.userId;
                } else if(game.moves.length >= 41) {
                    winner = "draw"
                }

                //now insert the move in the db
                Game.updateOne({ _id: game._id}, {
                    moves: [
                    ...game.moves,
                    {
                        player: req.body.userId,
                        value: movePlayed
                    }],
                    playerTurn: nextTurnValue,
                    winner: winner,
                    // time: {
                    //     host: req.body.times.host,
                    //     opponent: req.body.times.opponent
                    // }
                })
                    .then(() => res.status(201).json({ message: `coup joué ${movePlayed}`}))
                    .catch(error => res.status(404).json({ error: 'error in the update'}))
                
            }
            else{
                res.status(401).json({ message: 'cant play this'});
            }
        })
        .catch(error => res.status(404).json({ error: 'error in play'}))
}

exports.allmoves = (req,res, next) => {
    Game.findById(req.body.gameId)
        .then(game => {
            res.status(200).json({ allMoves : game.moves})
        })
        .catch(error => res.status(404).json({ error: 'this game doesnt exist'}))
}



