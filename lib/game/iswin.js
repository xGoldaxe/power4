exports.isWin = (moves, moveValue, playerId) => {
    const allDirection = ['horizontal','vertical','diagToTop','diagToBottom'];
    const result = allDirection.some(direction => {
        return testDirection(moveValue, moves, playerId, direction);
        
    }) 
    return result
}

function testDirection(moveValue, moves, playerId, direction) {
    let chainMove = 1;
    let stillCorrect = true;
    let test;
    let i = 1;
    let symbol = '+';
    let moveToTest;
    while(stillCorrect) {
        //select the correct direction 
        switch(direction) {
            case 'vertical':
                //reset value
                moveToTest = moveValue;
                //diag col+i line+i
                moveToTest = lineModify(moveValue, symbol, i);
                test = isCorrect(playerId, moves, moveToTest);
            break;
            case 'horizontal':
                //reset value
                moveToTest = moveValue;
                //diag col+i line+i
                moveToTest = columnModify(moveValue, symbol, i);
                test = isCorrect(playerId, moves, moveToTest);
            break;
            case 'diagToTop':
                //reset value
                moveToTest = moveValue;
                //diag col+i line+i
                moveToTest = lineModify(moveValue, symbol, i);
                moveToTest = columnModify(moveToTest, symbol, i);
                test = isCorrect(playerId, moves, moveToTest);
            break;
            case 'diagToBottom':
                //reset value
                moveToTest = moveValue;
                //diag col+i line-i
                moveToTest = lineModify(moveValue, symbol, i);
                moveToTest = columnModify(moveToTest, symbol, -i);
                test = isCorrect(playerId, moves, moveToTest, symbol, i);
            break;
        }
        if(test) {
            chainMove++;
            i ++;
        }
        else {
            //reset but with symbol -
            if(symbol === '+') {
                i = 1;
                symbol = '-'
            } else {
                stillCorrect = false;
            }
        }
    }
    //now verify is the game is win
    if(chainMove >= 4) {
        return true
    }
    return false
}

function isCorrect(playerId, moves, moveValue) {
    if(moveValue === null) {
        return false
    }
    const find = moves.find((move) => move.player === playerId && move.value === moveValue)
    if(find) {
        return true
    }
    return false
}

function lineModify(moveValue, symbol, i) {
    if(moveValue === null) {
        return null
    }
    if(symbol === '+') {
        result = parseInt(moveValue[1]) + i;

        if(result > 5) {
            return null
        }
    }
    else {
        result = parseInt(moveValue[1]) - i;
        if(result < 0) {
            return null
        }
    }
    return (moveValue[0] + result);
}

function columnModify(moveValue, symbol, i) {
    if(moveValue === null) {
        return null
    }
    
    const allLetter = ['A','B','C','D','E','F','G'];
    let columnNumber = allLetter.findIndex(letter => letter === moveValue[0]);

    if(symbol === '+') {
        columnNumber += i;
        if(columnNumber > 6) {
            return null
        }
    }
    else {
        columnNumber += -i;
        if(columnNumber < 0) {
            return null
        }
    }
    return (allLetter[columnNumber] + moveValue[1]);
}