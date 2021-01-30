const mongoose = require('mongoose');

const matchmakingSchema = mongoose.Schema({
    playerId: { type: String, required: true},
    rank: {type: Number, required: true}
});

module.exports = mongoose.model('Matchmaking', matchmakingSchema);