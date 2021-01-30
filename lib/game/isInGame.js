const Game = require('../../models/Game');

exports.isInGame = async function (userId) {
    //check if a game exist whith userId as host or opponent with winner as null
    const toTest = await Game.findOne({
        winner : null,
        $or : [{ host: userId}, { opponent: userId }]
    })
    
    if(toTest) {
        return toTest._id
    } 
    return false

    //return true or false
}