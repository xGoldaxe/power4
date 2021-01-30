const getGameState = require('../../lib/game/getGameState').getGameState;
const Game = require('../../models/Game');
//create the timer

//timer every secondes: call the db, modfiy it, and then send a socket to the user //done
//if time goes to 0 : new db modification then destroy the timer
//if someone win the game : destroy the timer

//that mean the interval will alway destroy himself
exports.createGameTimer = async function (socket, gameId){
    const timer = setInterval(async ()=>{
        let gameState = await getGameState(gameId);
        gameState = gameState.game;
        if(gameState.moves.length > 0) {
            //while nobody win
            if(!gameState.winner) {
                if(gameState.playerTurn === gameState.host) {
                    gameState.time.host --;
                    if(gameState.time.host === 0) {
                        gameState.winner = gameState.opponent;
                        clearInterval(timer);
                    }
                } else {
                    gameState.time.opponent --;
                    if(gameState.time.opponent === 0) {
                        gameState.winner = gameState.host;
                        clearInterval(timer);
                    }
                }
            } else {
                clearInterval(timer)
            }
    
            Game.updateOne({ _id: gameState._id}, {
                winner: gameState.winner,
                time: gameState.time
            })
                .then(() => {socket.to(gameState._id).emit('gameState', {game : gameState});})//the time has been veryified so its ok
        } else {
            Game.updateOne({ _id: gameState._id}, {
                afkAdvertisor: gameState.afkAdvertisor += -1
            })
                .then(() => {socket.to(gameState._id).emit('gameState', {game: gameState});})
            if(gameState.afkAdvertisor <= 0) {
                let winner;
                if(gameState.playerTurn === gameState.host) {
                    winner = gameState.opponent
                } else {
                    winner = gameState.host
                }
                Game.updateOne({_id: gameState._id},{
                    winner: winner
                })
                    .then(() => {
                        socket.to(gameState._id).emit('gameState', {game: {...gameState, winner: winner}});
                        clearInterval(timer);
                    })
            }
        }
    }, 1000) 
}
