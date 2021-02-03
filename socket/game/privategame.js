const fetch = require('node-fetch');
const Game = require('../../models/Game');
const gameCtrl = require('../../controllers/game');
const { createGameTimer } = require('./timer');
const { isInGame } = require('../../lib/game/isInGame');


exports.createPvGame = async function (socket, io) {

        socket.on('createPvGame', async(socketData) => {
            const inGame = await isInGame(socketData.userId)
            if(!inGame) {
                const data = {
                    userId: socketData.userId,
                    time: socketData.time
                }
                let dataResult = await fetch(`${process.env.API_PATH}/api/auth/game/create`, {
                    headers: {
                        "Content-type": "application/json;charset=UTF-8",
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + socketData.token
                    },
                    method: "POST",
                    body: JSON.stringify(data)
                })

                dataResult = await dataResult.json();
                socket.join('game:' + dataResult.game._id);
                io.to('game:' + dataResult.game._id).emit('createdPvGame', dataResult);
                
                socket.on('disconnect', (reason) => {
                    Game.find().where({ _id: dataResult.game._id })
                        .then((game) => {
                            if(game[0]) {
                                if(game[0].opponent.id === null) {
                                    Game.deleteOne({
                                        _id: dataResult.game._id
                                    })                    
                                } 
                            }
                        })
                })
                socket.on('deletePvGame', (socketData) => {
                    Game.find().where({ _id: socketData.gameId })
                    .then((game) => {
                        if(game[0]) {
                            if(game[0].opponent.id === null) {
                                Game.deleteOne({
                                    _id: socketData.gameId
                                })                    
                            } 
                        }
                    })
                })} else {
                    socket.join('game:' + socketData.userId);
                    io.to('game:' + socketData.userId).emit('joinedPvGame', inGame._id);
                    socket.leave('game:' + socketData.userId);
                }
            })
}


exports.joinPvGame = function (socket, io){
    socket.on('joinPvGame', async(socketData) => {
        const data = {
            userId: socketData.userId,
            gameId: socketData.gameId
        }
        
        let dataResult = await fetch(`${process.env.API_PATH}/api/auth/game/join`, {
            headers: {
                "Content-type": "application/json;charset=UTF-8",
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + socketData.token
            },
            method: "POST",
            body: JSON.stringify(data)
        })
        
        let result = '';
        if(dataResult.status === 200) {
            result = socketData.gameId;
            const promise = new Promise((resolve) => gameCtrl.gameStart(socketData.gameId, resolve));
            promise.then(() => {
                socket.join('game:' + socketData.gameId);
                io.to('game:' + socketData.gameId).emit('joinedPvGame', result)
                createGameTimer(io, socketData.gameId);
            });
        } else {
            result = null
            socket.join('game:' + socketData.gameId);
            io.to('game:' + socketData.gameId).emit('joinedPvGame', result)
        }
    })
}