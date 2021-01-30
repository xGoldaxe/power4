const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    gameType: { type: String, required: true},
    host: {type: String, required: true},
    opponent: {type: String},
    moves: {type: Array},
    playerTurn: {type: String},
    winner: {type: String},
    messages: {type: Array},
    time: {type: Object},
    afkAdvertisor: {type: Number}
});

module.exports = mongoose.model('Game', gameSchema);