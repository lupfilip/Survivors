function createMonster(type, x, y, pattern) { //monster data
    let monster = {
        type: type, //Piece type
        index: [x, y],
        moves: monsterMovement({type: type, index: [x,y]}),
        pattern: pattern
    }

    return monster;
}

function checkMonsters() { //Preveri ali se je vzela posast
    for(let i = 0; i < monsters.length; i++) {
        if(board[monsters[i].index[1]][monsters[i].index[0]] != monsters[i].type) { //Ce da

            do {
                var xM = Math.floor(Math.random() * board.length);
                var yM = Math.floor(Math.random() * board.length);
            } while(board[yM][xM] != 0);
 
            monsters[i] = createMonster(monsters[i].type, xM, yM, monsters[i].pattern); //Nov index
            board[yM][xM] = monsters[i].type;
        }
    }
}

function monsterMovement(monster) {
    switch(monster.type) {
        case 4:
            return knightMovement(monster);
        case 5:
            return bishopMovement(monster);
        case 6:
            return rookMovement(monster);
        case 7:
            return queenMovement(monster);
        default: 
            break;
    }
}

function knightMovement(monster) {
    let moves = [];
    for(let i = -2; i <= 2; i++) {
        for(let j = -2; j <= 2; j++) {
            if(i == 0 || j == 0 || Math.abs(i) == Math.abs(j)) {
                continue;
            }

            try {
                if(board[monster.index[1]+i][monster.index[0]+j] == 0 || board[monster.index[1]+i][monster.index[0]+j] == 2)
                {
                    moves.push([monster.index[0]+j, monster.index[1]+i]);
                }
            }
            catch {}
        }
    }

    return moves;
}

function bishopMovement(monster) {
    let moves = [];
    let block = [false, false, false, false];
    let dir = [[-1,-1],[-1,1],[1,-1],[1,1]];
    for(let i = 1; i <= 7; i++) {
        for(let j = 0; j < dir.length; j++) {
            try {
                if(board[monster.index[1]+dir[j][1]*i][monster.index[0]+dir[j][0]*i] == 0 || 
                    board[monster.index[1]+dir[j][1]*i][monster.index[0]+dir[j][0]*i] == 2)
                {
                    if(!block[j]) {
                        moves.push([monster.index[0]+dir[j][0]*i, monster.index[1]+dir[j][1]*i]);

                        if(board[monster.index[1]+dir[j][1]*i][monster.index[0]+dir[j][0]*i] == 2) {
                            block[j] = true;
                        }
                    }
                }
                else {
                    block[j] = true;
                }
            }
            catch {}
        }   
    }

    return moves;
}

function rookMovement(monster) {
    let moves = [];
    let block = [false, false, false, false];
    let dir = [[-1,0],[0,1],[0,-1],[1,0]];
    for(let i = 1; i <= 7; i++) {
        for(let j = 0; j < dir.length; j++) {
            try {
                if(board[monster.index[1]+dir[j][1]*i][monster.index[0]+dir[j][0]*i] == 0 || 
                    board[monster.index[1]+dir[j][1]*i][monster.index[0]+dir[j][0]*i] == 2)
                {
                    if(!block[j]) {
                        moves.push([monster.index[0]+dir[j][0]*i, monster.index[1]+dir[j][1]*i]);

                        if(board[monster.index[1]+dir[j][1]*i][monster.index[0]+dir[j][0]*i] == 2) {
                            block[j] = true;
                        }
                    }
                }
                else {
                    block[j] = true;
                }
            }
            catch {}
        }   
    }

    return moves;
}

function queenMovement(monster) {
    let moves = [];
    let block = [false, false, false, false, false, false, false, false];
    let dir = [[-1,0],[0,1],[0,-1],[1,0], [-1,-1],[-1,1],[1,-1],[1,1]];
    for(let i = 1; i <= 7; i++) {
        for(let j = 0; j < dir.length; j++) {
            try {
                if(board[monster.index[1]+dir[j][1]*i][monster.index[0]+dir[j][0]*i] == 0 || 
                    board[monster.index[1]+dir[j][1]*i][monster.index[0]+dir[j][0]*i] == 2)
                {
                    if(!block[j]) {
                        moves.push([monster.index[0]+dir[j][0]*i, monster.index[1]+dir[j][1]*i]);

                        if(board[monster.index[1]+dir[j][1]*i][monster.index[0]+dir[j][0]*i] == 2) {
                            block[j] = true;
                        }
                    }
                }
                else {
                    block[j] = true;
                }
            }
            catch {}
        }   
    }

    return moves;
}

function duplicatesRemove(repeats) { //Removes same indexes with higher depth
    //Efficiency for large boards
    let repeats2 = [];
    let skip = [];
    for(let i = 0; i < repeats.length; i++) {
        if(skip.includes(i)) continue;

        for(let j = i+1; j < repeats.length; j++) {

            if(JSON.stringify(repeats[i].index) == JSON.stringify(repeats[j].index)) {
                repeats[i].depth = Math.min(repeats[i].depth, repeats[j].depth);
                skip.push(j);
            }
        }
        
        repeats2.push(repeats[i]);
    }

    return repeats2;
}

function removeRepeatingMoves(monster, repeats, depth) { //Removes repeating moves in higher depths
    repeats = duplicatesRemove(repeats);

    monster.moves = monster.moves.filter(move => !repeats.some(repeat => JSON.stringify(repeat.index) == JSON.stringify(move)
        && repeat.depth <= depth));
}

function removeCaptures(monster) { //Removes possible captures
    for(let i = 0; i < monster.moves.length; i++) {
        let x = players.findIndex(player => player.moves.some(move => JSON.stringify(move) == JSON.stringify(monster.moves[i])));
        try {
            let y = players[x].moves.findIndex(move => JSON.stringify(move) == JSON.stringify(monster.moves[i]));
            if(x >= 0) {
                monster.moves = monster.moves.filter(move => JSON.stringify(move) != JSON.stringify(players[x].moves[y]));
                i = -1;
            }
        } catch {}
    }
}

function closestPlayer(monster, board, depth, repeatingM, indexP, maxD, moveIndex, save) { //Get closest player
    let monster2 = Object.assign({}, monster);
    removeCaptures(monster2); //Remove squares that the player can capture
    monster2.moves.forEach(move => repeatingM.push({index: move, depth: depth})); //Copy moves

    if(depth >= maxD.i) //Check if over max depth
    {
        repeatingM = duplicatesRemove(repeatingM);
        return depth;
    }

    for(let i = 0; i < monster2.moves.length; i++) { //For each move
        let monsterVoid = Object.assign({}, monster);
        let boardD = JSON.parse(JSON.stringify(board));

        if(players.some(player => JSON.stringify(player.index) == JSON.stringify(monster2.moves[i]))) {
            //Can capture player -> save player index
            indexP.i = players.findIndex(player => JSON.stringify(player.index) == JSON.stringify(monster2.moves[i]));
            repeatingM = duplicatesRemove(repeatingM);

            save.i = true;

            if(save && depth <= 0) {
                moveIndex.push(monster2.moves[i]);
                save.i = false;
            }

            return depth;
        }
        else if(depth >= maxD.i) { //Exit on depth break
            repeatingM = duplicatesRemove(repeatingM);

            if(save && depth <= 0) {
                moveIndex.push(monster2.moves[i]);
                save.i = false;
            }
            
            return depth;
        }
        else { //Search depth
            boardD[monster2.index[1]][monster2.index[0]] = 0;
            boardD[monster2.moves[i][1]][monster2.moves[i][0]] = monster2.type;
            monsterVoid = createMonster(monster2.type, monster2.moves[i][0], monster2.moves[i][1], monster2.pattern);
            removeRepeatingMoves(monsterVoid, repeatingM, depth); //Remove squares that repeat on bigger depths
            maxD.i = Math.min(maxD.i, closestPlayer(monsterVoid, boardD, depth+1, repeatingM, indexP, maxD, moveIndex, save));
            repeatingM = duplicatesRemove(repeatingM);

            if(save && depth <= 0) {
                moveIndex.push(monster2.moves[i]);
                save.i = false;
            }
        }
    }

    repeatingM = duplicatesRemove(repeatingM);
    return depth;
}

function playerDepth(player, board, depth, maxD) { //Get all indexes of player for depth

    var moveL = []
    let player2 = Object.assign({}, player);
    player2.moves.forEach(move => moveL.push({index: move, depth: depth}));

    if(depth >= maxD) {
        moveL = duplicatesRemove(moveL);
        return moveL;
    }
    else {
        for(let i = 0; i < player2.moves.length; i++) { //For each move
            let playerVoid = Object.assign({}, player);
            let boardD = JSON.parse(JSON.stringify(board));
            boardD[player2.index[1]][player2.index[0]] = 0;
            boardD[player2.moves[i][1]][player2.moves[i][0]] = 2;
            playerVoid = createPlayer(player2.name, player2.moves[i][0], player2.moves[i][1], player2.pattern);

            removeRepeatingMoves(playerVoid, moveL, depth); //Remove squares that repeat on bigger depths
            //For found moves in depth add to list
            playerDepth(playerVoid, boardD, depth+1, maxD).forEach(data => moveL.push(data));
            moveL = duplicatesRemove(moveL);
        }
    }

    return moveL; //Get indexes
}

function captureProcent(playerL, monsterL, player) { //Get number of possible captures
    let count = 0;
    if(monsterL.some(data => JSON.stringify(data) == JSON.stringify(player.index))) {
        return 1000;
    }
    for(let i = 0; i < playerL.length; i++) {
        if(monsterL.some(data => JSON.stringify(data) == JSON.stringify(playerL[i].index))) {
            count++;

            if(count >= monsterL.length) break;
        }
    }

    count = count * 100 / playerL.length; //Turn to procentage

    return count;
}