//every seconds get all the matchmaking entries 
// -> 1 player, do nothing
// 2 player => match them together
// 3 player => match the two on with the closest rank
// 4 and more => same operation but 2 or 3 or 4 times...
//when a game is find => delete the player from the matchmaking => create a game => send to the both player room 'matchmaking:playerId' 
const Matchmaking = require('../models/Matchmaking');
const Game = require('../models/Game');
const { send } = require('process');
const { createGameTimer } = require('../socket/game/timer');

exports.matchmaking = function(socket) {
    setInterval(()=>{
        Matchmaking.find({})
            .then((matchmaking) => {
                if(matchmaking.length >= 2) {
                    createGame(socket, matchmaking[0],matchmaking[1], 180)
                }
            })
    }, 1000)
}

async function createGame(socket, player1, player2, time) {
    const ranInt = Math.round(Math.random()); //0 or 1
    let host, opponent;
    if(ranInt) {
        host = player1;
        opponent = player2;
    } else {
        host = player2;
        opponent = player1;
    }
    //first delete
    await Matchmaking.deleteMany({
        playerId: player1.playerId
    })
    await Matchmaking.deleteMany({
        playerId: player2.playerId
    })
    //now create a game with the correct information + mode
    console.log('ranked well created')
    const game = new Game({
        gameType : 'ranked',
        host : host.playerId,
        opponent : opponent.playerId,
        moves: [],
        playerTurn: host.playerId,
        winner: null,
        messages: [],
        time: {
            host : time,
            opponent : time
        },
        afkAdvertisor: 45
    });
    const gameInfo = await game.save()
    socket.to('matchmaking:' + player1.playerId).emit('gameStart', gameInfo._id)
    socket.to('matchmaking:' + player2.playerId).emit('gameStart', gameInfo._id)
    createGameTimer(socket, gameInfo._id);
}