const fetch = require('node-fetch');
const { json } = require('body-parser');
const play = require('./game/play');
const  pvGame = require('./game/privategame')
const  matchmaking = require('./game/matchmaking')

exports.main = (io) => {
    
    io.on('connection', (socket) => {
        console.log('basic connection');
        //createGame(socket, io);
        play.playMove(socket, io);
        play.joinGameRoom(socket, io);
        pvGame.createPvGame(socket, io);
        pvGame.joinPvGame(socket, io);
        //
        matchmaking.joinMatchmaking(socket, io);
    })
}
