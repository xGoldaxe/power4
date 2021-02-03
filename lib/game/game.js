exports.swapTurn = (game) => {
    let nextTurnValue;
    if(game.playerTurn === game.host.id) {
        nextTurnValue = game.opponent.id;
    } else {
        nextTurnValue = game.host.id;
    }
    return(nextTurnValue)
}

exports.createMove = (req, game) => {
    const moveColumn = req.body.move[0];
    //take all the move play on the column
    const allColumnMoves = []
    game.moves.forEach(move => {
        if(move.value[0] === req.body.move[0]){
            allColumnMoves.push(move.value)
        }
    });
    //test every line to see where it can be place
    let line = 0;
    let taken = true;
    while(taken) {
        let move = req.body.move[0] + line;
        if(allColumnMoves.includes(move)) {
            taken = true;
            line++;
        } else {
            taken = false
        }    
    }
    if (line > 5) {
        throw 'too high'
    }
    return (req.body.move[0] + line)
}
