const Game = require("../../models/Game")
const User = require("../../models/User")
const { newRank } = require("./newRank")

exports.setNewRank = async function (winner, game) {
    if(game.gameType === 'ranked') {
        let hostNewRank, opponentNewRank
        if(winner === game.host.id) {
            hostNewRank = newRank(game.host.actualRank, 'win')
            opponentNewRank = newRank(game.opponent.actualRank, 'lose')
        } else if(winner === game.opponent.id) {
            hostNewRank = newRank(game.host.actualRank, 'lose')
            opponentNewRank = newRank(game.opponent.actualRank, 'win')
        } else if(winner === 'draw') {
            hostNewRank = newRank(game.host.actualRank, 'draw')
            opponentNewRank = newRank(game.opponent.actualRank, 'draw')
        }
        const result = await Game.updateOne({ _id: game._id }, {
            'host.newRank': hostNewRank,
            'opponent.newRank': opponentNewRank,
            winner: winner
        })
        if(result.ok === 1) {     
            await User.updateOne({ _id : game.host.id }, {
                rank: hostNewRank
            })
            await User.updateOne({ _id : game.opponent.id }, {
                rank: opponentNewRank
            })
            return true
        }
    } else {
        return false
    }
}
