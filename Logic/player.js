function playerMovement(player) { //Generates player moves
    let moves = [];

    for(let i = -1; i <= 1; i++) {
        for(let j = -1; j <= 1; j++) {
            if(i == 0 && j == 0) continue;

            try { //checks if move is an error
                if(board[player.index[1]+i][player.index[0]+j] == 0 || board[player.index[1]+i][player.index[0]+j] > 2)
                    moves.push([player.index[0]+j, player.index[1]+i]);
            }
            catch {}
        }
    }

    return moves;
}

function createPlayer(name, x, y, pattern) { //Player data
    let player = {
        name: name,
        index: [x, y],
        indexS: [Math.floor(x/field), Math.floor(y/field)], //NxN index
        indexF: [x%field, y%field], //8x8 index in section index
        monsterS: sensingMonster(x, y),
        monsterD: monsterDistance(x, y),
        moves: playerMovement({index: [x,y]}),
        pattern: pattern
    };

    return player;
}

function sensingMonster(x, y) {
    for(let i = 0; i < monsters.length; i++) { //Each monster
        //If distance to a monster is less than 7
        let vecji = Math.max(Math.abs(monsters[i].index[0] - x), Math.abs(monsters[i].index[1] - y))
        if(vecji < 8)
        {
            return true;
        }
    }

    return false;
}

function monsterDistance(x, y) {
    let closest = Infinity;
    for(let i = 0; i < monsters.length; i++) { //Each monster
        //If distance to a monster is less than 7
        let smaller = Math.max(Math.abs(monsters[i].index[0] - x), Math.abs(monsters[i].index[1] - y))
        closest = Math.min(closest, smaller);
    }

    if(sensingMonster(x,y))
        return closest;
    else 
        return ("No monster nearby.");
}

function playerData(player, board, index) { //Display player
    let sense = ["NO", "YES"];
    let indexB = [false, true];
    index[0] = parseInt(player.indexS[0]) * field;
    index[1] = parseInt(player.indexS[1]) * field;

    shiftIndex(board, index,0,0, document.getElementById("board")); //Shift to player

    //Data
    document.getElementById("name").innerText = "Name: " + player.name;
    document.getElementById("index").innerText = "Index: "+(player.index[0]+1)+'|'+(player.index[1]+1);
    document.getElementById("indexS").innerText = "Section index: "+(player.indexS[0]+ 1)+'|'+(player.indexS[1]+ 1);
    document.getElementById("indexF").innerText = "Section field index: "+(player.indexF[0] + 1)+'|'+(player.indexF[1] + 1);
    document.getElementById("monsterS").innerText = "Sensing monster: " + sense[indexB.indexOf(player.monsterS)];
    document.getElementById("monsterD").innerText = "Monster distance (closest): " + player.monsterD;
    document.getElementById("token").innerText = "Tokens left: " + tokens.length;
    document.getElementById("alive").innerText = "Players left: " + players.length;

    writeDeadPlayers();
}

function checkPlayers() { //Check if player has been taken
    for(let i = 0; i < players.length; i++) {
        if(board[players[i].index[1]][players[i].index[0]] != 2) { //Ce vzet igralec

            playersD.push(players.find(player => JSON.stringify(player) == JSON.stringify(players[i])));
            players = players.filter(player => JSON.stringify(player) != JSON.stringify(players[i]));
            return 1;
        }
    }

    return 0;
}

function writeDeadPlayers() { //Get list of dead players
    var list = document.getElementById("players");
    list.innerHTML = "";
    for(let i = 0; i < playersD.length; i++) {
        let player = document.createElement("li");
        player.innerHTML = playersD[i].name;
        list.appendChild(player);
    }
}

function revivePlayer() { //Revive player
    if(playersD.length <= 0) return;

    do {
        playersD[0].index = [Math.floor(Math.random() * board.length), Math.floor(Math.random() * board.length)];
    } while(board[playersD[0].index[1]][playersD[0].index[0]] != 0); //Find empty index

    board[playersD[0].index[1]][playersD[0].index[0]] = 2;

    //Update lists, moves
    players.push(createPlayer(playersD[0].name, playersD[0].index[0], playersD[0].index[1], playersD[0].pattern));
    playersD = playersD.filter(data => JSON.stringify(data) != JSON.stringify(playersD[0]));

    monsters = monsters.map(monster => createMonster(monster.type, monster.index[0], monster.index[1], monster.pattern));
    players = players.map(player => createPlayer(player.name, player.index[0], player.index[1], player.pattern));
}