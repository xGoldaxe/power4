const fetch = require('node-fetch');
const { json } = require('body-parser');
const getGameState = require('../../lib/game/getGameState').getGameState;
const createGameTimer = require('./timer').createGameTimer;

exports.joinGameRoom = (socket, io) => {
    socket.on('joinGameRoom', (gameId) => {
        socket.join(gameId);
    })
}

exports.playMove = (socket, io) => {
    socket.on('playMove', async(socketData) => {
        const data = {
            userId: socketData.userId,
            gameId: socketData.gameId,
            move: socketData.move
        }
        const response = await fetch(`${process.env.API_PATH}/api/auth/game/play`, {
            headers: {
                "Content-type": "application/json;charset=UTF-8",
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + socketData.token
            },
            method: "POST",
            body: JSON.stringify(data)
        })

        if(response.status === 201) {
            const resultJson = await getGameState(data.gameId);
            io.to(socketData.gameId).emit('gameState', resultJson.game);
        }
    })
}

