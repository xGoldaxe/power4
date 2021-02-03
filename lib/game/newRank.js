const User = require("../../models/User")

exports.newRank = function(rank, result) {
    if(result === 'win') {
        return rank + 1
    } else if(result === 'lose'){
        if(rank > 8) {
            rank += -1
        }
        return rank
    } else if (result === 'draw') {
        return rank
    }
}