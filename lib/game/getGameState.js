const fetch = require('node-fetch');

exports.getGameState = async function (gameId) {
    const result = await fetch(`${process.env.API_PATH}/api/auth/game/information`, {
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            'Accept': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({gameId: gameId})
    })
    const resultJson = await result.json()  // convert to json
    return resultJson
};

