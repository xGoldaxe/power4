const getGameState = require('../../lib/game/getGameState').getGameState;
const Game = require('../../models/Game');
//create the timer
const { setNewRank } = require('../../lib/game/setNewRank');

exports.createGameTimer = async function (socket, gameId){
    const timer = setInterval(async ()=>{
        let gameState = await getGameState(gameId);
        gameState = gameState.game;
        if(gameState.moves.length > 0) {
            //while nobody win
            if(!gameState.winner) {
                if(gameState.playerTurn === gameState.host.id) {
                    gameState.time.host --;
                    if(gameState.time.host === 0) {
                        gameState.winner = gameState.opponent.id;
                        clearInterval(timer);
                    }
                } else {
                    gameState.time.opponent --;
                    if(gameState.time.opponent === 0) {
                        gameState.winner = gameState.host.id;
                        clearInterval(timer);
                    }
                }
            } else {
                clearInterval(timer)
            }
    
            await Game.updateOne({ _id: gameState._id}, {
                winner: gameState.winner,
                time: gameState.time
            })
            if(gameState.winner) {
                await setNewRank(gameState.winner, gameState)
            }
            const game = await Game.findById(gameState._id)
            socket.to(gameState._id).emit('gameState', game);
        } else {
            Game.updateOne({ _id: gameState._id}, {
                afkAdvertisor: gameState.afkAdvertisor += -1
            })
                .then(() => {socket.to(gameState._id).emit('gameState', gameState);})
            if(gameState.afkAdvertisor <= 0) {
                let winner;
                if(gameState.playerTurn === gameState.host.id) {
                    winner = gameState.opponent.id
                } else {
                    winner = gameState.host.id
                }
                await setNewRank(winner, gameState)
                const game = await Game.findById(gameState._id)
                socket.to(gameState._id).emit('gameState', game);
                clearInterval(timer);
            }
        }
    }, 1000) 
}
