const fetch = require('node-fetch');
const Matchmaking = require('../../models/Matchmaking');
const gameCtrl = require('../../controllers/game');
const { use } = require('../../routes/user');
const User = require('../../models/User');
const { isInGame } = require('../../lib/game/isInGame');

exports.joinMatchmaking = function (socket, io) {
    socket.on('joinMatchmaking', async(socketData) => {
        const inGame = await isInGame(socketData.userId)
        if(!inGame) {
            const data = {
                userId: socketData.userId
            }
            let dataResult = await fetch('http://localhost:8080/api/auth/matchmaking/join', {
                headers: {
                    "Content-type": "application/json;charset=UTF-8",
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + socketData.token
                },
                method: "POST",
                body: JSON.stringify(data)
            })
            
            socket.join('matchmaking:' + socketData.userId);
            
            socket.removeAllListeners('disconnect')
            socket.once('disconnect', async (reason) => {
                socket.leave('matchmaking:' + socketData.userId);
                const isDeleted = await Matchmaking.deleteMany({
                    playerId: socketData.userId
                })
            })
    
            socket.once('leaveMatchmaking', async() => {
                socket.leave('matchmaking:' + socketData.userId);
                const isDeleted = await Matchmaking.deleteMany({
                    playerId: socketData.userId
                })
            })
        } else {
            socket.join('matchmaking:' + socketData.userId);

            io.to('matchmaking:' + socketData.userId).emit('gameStart', inGame._id);

            socket.leave('matchmaking:' + socketData.userId);
        }
    })
}
