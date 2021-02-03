const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    gameType: { type: String, required: true},
    host: {type: Object, required: true},
    opponent: {type: Object},
    moves: {type: Array},
    playerTurn: {type: String},
    winner: {type: String},
    messages: {type: Array},
    time: {type: Object},
    afkAdvertisor: {type: Number},
    date: {type: Date}
});

module.exports = mongoose.model('Game', gameSchema);