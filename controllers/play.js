const { json } = require('body-parser');
const { table } = require('console');


const Game = require('../models/Game');
const gameAction = require('../lib/game/game');
const win = require('../lib/game/iswin');
const { setNewRank } = require('../lib/game/setNewRank');

exports.play = (req, res, next) => {
    Game.findById(req.body.gameId)
        .then(async game => {
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

                //check if winner is null
                //now insert the move in the db
                if(winner === null) {
                    Game.updateOne({ _id: game._id}, {
                        moves: [
                        ...game.moves,
                        {
                            player: req.body.userId,
                            value: movePlayed
                        }],
                        playerTurn: nextTurnValue
                    })
                        .then(() => res.status(201).json({ message: `coup joué ${movePlayed}`}))
                        .catch(error => res.status(404).json({ error: 'error in the update'}))

                } else {
                    if(game.gameType === 'ranked') {
                        setNewRank(winner, game)
                    }
                    //update last shot
                    Game.updateOne({ _id: game._id}, {
                        moves: [
                        ...game.moves,
                        {
                            player: req.body.userId,
                            value: movePlayed
                        }],
                        winner: winner,
                        playerTurn: nextTurnValue
                    })  
                        .then(() => res.status(201).json({ message: `coup joué ${movePlayed}`}))
                        .catch(error => res.status(404).json({ error: 'error in the update'}))

                }

                //else {setup the win}
            }
            else{
                res.status(401).json({ message: 'cant play this'});
            }
        })
        .catch(error => res.status(403).json({ error: 'error in play'}))
}

exports.allmoves = (req,res, next) => {
    Game.findById(req.body.gameId)
        .then(game => {
            res.status(200).json({ allMoves : game.moves})
        })
        .catch(error => res.status(404).json({ error: 'this game doesnt exist'}))
}



// if(winner === game.host.id) {
//     hostNewRank = newRank(game.host.actualRank, 'win')
//     opponentNewRank = newRank(game.opponent.actualRank, 'lose')
// } else if(winner === game.opponent.id) {
//     hostNewRank = newRank(game.host.actualRank, 'lose')
//     opponentNewRank = newRank(game.opponent.actualRank, 'win')
// } else if(winner === 'draw') {
//     hostNewRank = newRank(game.host.actualRank, 'draw')
//     opponentNewRank = newRank(game.opponent.actualRank, 'draw')
// }
// const result = await Game.updateOne({ _id: game._id }, {
//     'host.newRank': hostNewRank,
//     'opponent.newRank': opponentNewRank,
//     winner: winner
// })
// if(result.ok === 1) {     
//     await User.updateOne({ _id : game.host.id }, {
//         rank: hostNewRank
//     })
//     await User.updateOne({ _id : game.opponent.id }, {
//         rank: opponentNewRank
//     })
// }