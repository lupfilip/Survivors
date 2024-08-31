function newBoard(size) { //Get size of board with 8x8 grids inside
    var board = [];

    for(let i = 0; i < size * field; i++) {
        board.push([]);
        for(let j = 0; j < size * field; j++) {
            board[i].push(0); //Empty board
        }
    }

    return board;
}

function getImage(value) { //Images for pieces
    switch(value) {
        case 1:
            return '../Images/Pawn_black.png';
        case 2:
            return '../Images/Pawn_white.png';
        case 3:
            return '../Images/King_black.png';
        case 4:
            return '../Images/Knight_black.png';
        case 5:
            return '../Images/Bishop_black.png';
        case 6:
            return '../Images/Rook_black.png';
        case 7:
            return '../Images/Queen_black.png';
        case -2:
            return '../Images/King_white.png';
        default: break;
    }

    return "";
}

function boardFull(board) { //Draw entire board (for console)
    var drawing = "";
    for(let i = board.length - 1; i >= 0; i--) {
        for(let j = 0; j < board.length; j++) {
            drawing += " " + board[i][j] + " ";
        }
        drawing += "\n";
    }

    return drawing;
}

function board8x8_console(board, x, y) { //Draw 8x8 board from specific indexes
    var drawing = "";
    for(let i = field - 1; i >= 0; i--) {
        for(let j = 0; j < field; j++) {
            drawing += " " + board[i+y][j+x] + " ";
        }
        drawing += "\n";
    }

    return drawing;
}

function board8x8(board, x, y) { //Draw 8x8 board from specific indexes
    var color = ["dark", "light"]; //Class of square color
    var boardHTML = document.getElementById("board");
    boardHTML.innerHTML = "";
    var indexes = [];
    var indexes2 = [];
    for(let i = -2; i <=2; i++) { //Vision 2 squares
        for(let j = -2; j <=2; j++) {
            players.forEach(player => {
                if(Math.abs(i) <= 1 && Math.abs(j) <= 1)
                    indexes.push([player.index[0]+j, player.index[1]+i]);

                if(Math.abs(i) == 2 || Math.abs(j) == 2)
                    indexes2.push([player.index[0]+j, player.index[1]+i]);
            });
            if(Math.abs(i) <= 1 && Math.abs(j) <= 1)
                indexes.push([players[turn].index[0]+j, players[turn].index[1]+i]);
            if(Math.abs(i) == 2 || Math.abs(j) == 2)
                indexes2.push([players[turn].index[0]+j, players[turn].index[1]+i]);
        }
    }
    
    players.forEach(player => { //Vision 1 square
        player.moves.forEach(move => {
            indexes.push(move);
        });
        indexes.push(player.index);
    });

    for(let i = field; i >= -1; i--) {
        for(let j = -1; j <= field; j++) {
            var square = document.createElement("div");

            if((i+1) % 9 == 0 && (j+1) % 9 == 0) {
            }
            else if((i+1) % 9 == 0) { //Row index
                square.innerHTML = (1+x+j);
            }
            else if((j+1) % 9 == 0) { //Column index
                square.innerHTML = (1+y+i);
            }
            else { //Squares
                square.classList.add("square");
                var img = document.createElement("img");
                if(board[y+i][x+j] == 2 && JSON.stringify(players[turn].index) == JSON.stringify([x+j, y+i]))
                    img.src = getImage(-board[y+i][x+j]); //Image for the player
                else
                    img.src = getImage(board[y+i][x+j]); //Image for allies

                square.appendChild(img);
                square.classList.add(color[(j+i) % 2]);

                square.id = (x+j)+"-"+(y+i);
                square.addEventListener("click", function() {movePiece(this);});

                if(indexes.some(index => JSON.stringify(index) == JSON.stringify([x+j,y+i])))
                    square.style.opacity = 1;
                else if(indexes2.some(index => JSON.stringify(index) == JSON.stringify([x+j,y+i])))
                    square.style.opacity = 0.5;
                else
                    square.style.opacity = 0;

                    //square.style.opacity = 1;
            }

            boardHTML.appendChild(square);
        }
    }
    return boardHTML;
}

function shiftButton(e) {
    let shift = e.key;

    switch(shift) {
        case "ArrowUp":
            e.preventDefault();
            shiftIndex(board, index, 0, 1, document.getElementById("UP"));
            break;
        case "ArrowLeft":
            e.preventDefault();
            shiftIndex(board, index, -1, 0, document.getElementById("LEFT"));
            break;
        case "ArrowRight":
            e.preventDefault();
            shiftIndex(board, index, 1, 0, document.getElementById("RIGHT"));
            break;
        case "ArrowDown":
            e.preventDefault();
            shiftIndex(board, index, 0, -1, document.getElementById("DOWN"));
            break;
        default: 
            break;
    }
}

function shiftIndex(board, index, x, y, button) { //shift 8x8 grid view
    if(button.disabled) return; //If shift button disabled

    index[0] = (index[0] + 8 * x); //Save shift index
    index[1] = (index[1] + 8 * y);
    board8x8(board, index[0], index[1]); //Draw new board

    //Check if buttons need to disable
    if(index[0] >= board.length - field) {
        document.getElementById("RIGHT").disabled = true;
    }
    else {
        document.getElementById("RIGHT").disabled = false;
    }

    if(index[0] <= 0) {
        document.getElementById("LEFT").disabled = true;
    }
    else {
        document.getElementById("LEFT").disabled = false;
    }

    if(index[1] >= board.length - field) {
        document.getElementById("UP").disabled = true;
    }
    else {
        document.getElementById("UP").disabled = false;
    }

    if(index[1] <= 0) {
        document.getElementById("DOWN").disabled = true;
    }
    else {
        document.getElementById("DOWN").disabled = false;
    }

}

function sectionWalls(board, xS, yS) { //Generates walls
    //Uses section indexes
    for(let i = 0; i < 16; i++) {

        let Y = (field * yS + Math.floor(Math.random() * field));
        let X = (field * xS + Math.floor(Math.random() * field));
        if(board[Y][X] == 0)
        {
            board[Y][X] = 1;
        }
        else {
            i--;
        }
    }
}

function startGame() { //Create start game
    document.addEventListener("keydown", function(e) { shiftButton(e); });

    document.getElementById("menu").hidden = true;
    document.getElementById("game").hidden = false;
    var count = document.getElementById("listP");

    index = [0, 0];

    let N = 1;
    while(count.children.length / N > N) {N++;} //Get appropriate NxN size

    board = newBoard(N); //new board

    for(let i = 0; i < board.length / field; i++) {
        for(let j = 0; j < board[i].length / field; j++) {
            sectionWalls(board, j, i); //Each section gets his walls
        }
    }

    players = [];
    playersD = [];
    tokens = [];
    let indexList = [];
    let tokenL = (N*N-1) * 7 + 3;
    let m = 0;

    for(let i = 0; i < tokenL; i++) { //tokens

        if(i >= m * tokenL / (N*N)) //If tokens for section filled
        {
            do {
                var start = Math.floor(Math.random() * (N * N));
                var xS = start % N;
                var yS = Math.floor(start / N);
            } while(indexList.includes(start));
            indexList.push(start);
            m++;
        }

        do {
            var x = Math.floor(Math.random() * field);
            var y = Math.floor(Math.random() * field);
        } while(board[y + yS * field][x + xS * field] != 0 ||
            playerMovement({index: [x+xS*field, y+yS*field]}).length <= 0);

        board[y + yS * field][x + xS * field] = 3;
        tokens.push([x + xS * field, y + yS * field]); //Save only indexes of tokens
    }

    indexList = [];
    monsters = [];

    for(let i = 0; i < 4; i++) { //monsters
        do {
            var x = Math.floor(Math.random() * board.length);
            var y = Math.floor(Math.random() * board.length);
        } while(board[y][x] != 0 || monsterMovement({type: 4+i, index: [x,y]}).length <= 0);

        
        monsters.push(createMonster(4+i, x, y, [[x,y]]));
        board[y][x] = 4 + i;
    }

    monsters.forEach(monster => monster.moves = monsterMovement(monster));

    indexList = [];

    for(let i = 0; i < count.children.length; i++) { //players
        do { //Each player in his own section
            var start = Math.floor(Math.random() * (N * N));
            var xS = start % N;
            var yS = Math.floor(start / N);
        } while(indexList.includes(start));
        indexList.push(start);

        do {
            var x = Math.floor(Math.random() * field);
            var y = Math.floor(Math.random() * field);
        } while(board[y + yS * field][x + xS * field] != 0 || 
            playerMovement({index: [x+xS*field, y+yS*field]}).length <= 0);

        if(count.children[i].value != "") //If entered a name
            players.push(createPlayer(count.children[i].value, x+xS * field, y+yS * field, [[x+xS*field, y+yS*field]]));
        else
            players.push(createPlayer(count.children[i].placeholder, x+xS * field, y+yS * field, [[x+xS*field, y+yS*field]]));

        board[y + yS * field][x + xS * field] = 2;
    }

    turn = 0;
    playerData(players[turn], board, index);

    audio = new Audio('../Audio/back.mp3');
    audio.currentTime = 0;
    audio.play();
    audio.loop = true;
}

function movePiece(move) { //Moving the piece
    let square = move.id.split("-"); //split id coordinates
    square = square.map(function(cell) {return parseInt(cell);}); //get indexes as numbers
    //Compare indexes of moves to selected
    let moveI = players[turn].moves.findIndex(move2 => JSON.stringify(move2) == JSON.stringify(square));

    if(moveI >= 0) { //Found move
        if(board[players[turn].moves[moveI][1]][players[turn].moves[moveI][0]] == 3) {
            //If token has been taken
            tokens = tokens.filter(token => JSON.stringify(token) != JSON.stringify(square));
            //revivePlayer();
        }

        //Update board, player, monsters and shift to next player
        board[players[turn].index[1]][players[turn].index[0]] = 0;
        board[players[turn].moves[moveI][1]][players[turn].moves[moveI][0]] = 2;
        checkMonsters();
        //Premaknemo svojo figuro
        players[turn] = createPlayer(players[turn].name, players[turn].moves[moveI][0], players[turn].moves[moveI][1], 
            players[turn].pattern);
        players[turn].pattern.push(players[turn].index);
        //Posodobimo druge figure (bolj premiki)
        players = players.map(player => createPlayer(player.name, player.index[0], player.index[1], player.pattern));
        monsters = monsters.map(monster => createMonster(monster.type, monster.index[0], monster.index[1], monster.pattern));

        if(tokens.length <= 0) {
            audio.pause();
            var step = new Audio("../Audio/win.mp3");
            step.volume = 0.2;
            step.play();
            document.getElementById("finish").style.display = "flex";
            document.getElementById("state").innerHTML = "YOU HAVE WON.";

            return;
        }

        turn = (turn+1) % (players.length + monsters.length);
        if(turn < players.length) {
            players[turn].moves = playerMovement(players[turn]);

            if(players[turn].moves.length <= 0) {
                executeTeleport(players[turn], 2);
            }

            teleportPiece(players[turn], false, 2);

            index = players[turn].index;
            index = [index[0] - index[0] % 8, index[1] - index[1] % 8];

            var step = new Audio("../Audio/step.mp3");
            step.play();

            playerData(players[turn], board, index);
        }
        else {
            do { //Do monster moves
                monsters.forEach(monster => monster.moves = monsterMovement(monster));
                if(monsters[turn - players.length].moves <= 0) {
                    executeTeleport(monsters[turn - players.length], monsters[turn-players.length].type);
                }
                else {

                    let monsterL = [];
                    let playerL = [];
                    let indexP = {i: -1};
                    let monsterMove = [];
                    let maxD = {i: field*3/4};
                    let save = {i: false};
                    let pieceC = [];
                    var indexPro;

                    try {
                        closestPlayer(monsters[turn - players.length], board, 0, monsterL, indexP, maxD, monsterMove, save);
                        if(indexP.i >= 0) {
                            playerL = playerDepth(players[indexP.i], board, 0, maxD.i);

                            //Get player can be captured move index
                            indexPro = monsterMove.findIndex(data => captureProcent(playerL, [data], players[indexP.i]) > 100);

                            if(indexPro < 0) { //Get best match
                                monsterMove.forEach(data => pieceC.push(captureProcent(playerL, createMonster(
                                    monsters[turn - players.length].type, data[0], data[1], monsters[turn - players.length].pattern).moves, 
                                    players[indexP.i] )));
                                indexPro = pieceC.indexOf(Math.max(...pieceC));
                            }

                            indexPro = indexPro * (indexPro > 0);

                            monsterMove = monsterMove[indexPro];
                        }
                        else if(monsterMove.length > 0) { //Has list
                            monsterMove.forEach(data => pieceC.push(createMonster(
                                monsters[turn - players.length].type, data[0], data[1], 
                                monsters[turn - players.length].pattern).moves.length));

                            if(pieceC.every(data => data == pieceC[0])) {
                                indexPro = monsterMove.findIndex(data => JSON.stringify(data) ==
                                    JSON.stringify(monsters[turn - players.length].pattern[
                                    monsters[turn - players.length].pattern.length - 1]));
                            }
                            else {
                                indexPro = pieceC.indexOf(Math.max(...pieceC));
                            }

                            indexPro = indexPro * (indexPro > 0);

                            monsterMove = monsterMove[indexPro];
                        }
                        else if(monsters[turn-players.length].moves.length > 0) {
                            monsters[turn-players.length].moves.forEach(data => pieceC.push(createMonster(
                                monsters[turn - players.length].type, data[0], data[1], 
                                monsters[turn - players.length].pattern).moves.length));

                            if(pieceC.every(data => data == pieceC[0])) {
                                indexPro = monsters[turn-players.length].moves.findIndex(data => JSON.stringify(data) ==
                                    JSON.stringify(monsters[turn - players.length].pattern[
                                    monsters[turn - players.length].pattern.length - 1]));
                            }
                            else {
                                indexPro = pieceC.indexOf(Math.max(...pieceC));
                            }

                            indexPro = indexPro * (indexPro > 0);

                            monsterMove = monsters[turn-players.length].moves[indexPro];
                        }
                        else { //Empty list
                            throw new Error("Empty list");
                        }
                    }
                    catch(error) {
                        do {
                            monsterMove = [Math.floor(Math.random() * board.length), Math.floor(Math.random() * board.length)];
                        } while(board[monsterMove[1]][monsterMove[0]] != 0);
                        console.log(error);
                    }

                    board[monsters[turn - players.length].index[1]][monsters[turn - players.length].index[0]] = 0;
                    board[monsterMove[1]][monsterMove[0]] = monsters[turn - players.length].type;
                    monsters[turn - players.length] = createMonster(monsters[turn - players.length].type, 
                        monsterMove[0], monsterMove[1], monsters[turn - players.length].pattern);
                    monsters[turn - players.length].pattern.push(monsters[turn - players.length].index);
                }

                turn -= checkPlayers();
                monsters = monsters.map(monster => createMonster(monster.type, monster.index[0], monster.index[1],
                    monster.pattern));
                players = players.map(player => createPlayer(player.name, player.index[0], player.index[1], player.pattern));

                teleportPiece(monsters[turn-players.length], false, monsters[turn-players.length].type);
                
                turn = (turn+1) % (players.length + monsters.length);
            } while(turn >= players.length && players.length > 0);

            turn = 0;

            try {
                players[turn].moves = playerMovement(players[turn]);

                if(players[turn].moves.length <= 0) {
                    executeTeleport(players[turn], 2);
                }

                teleportPiece(players[turn], false, 2);

                index = players[turn].index;
                index = [index[0] - index[0] % 8, index[1] - index[1] % 8];

                var step = new Audio("../Audio/step.mp3");
                step.play();

                playerData(players[turn], board, index);
            }
            catch {
                audio.pause();
                var step = new Audio("../Audio/lose.mp3");
                step.volume = 0.2;
                step.play();
                document.getElementById("finish").style.display = "flex";
                document.getElementById("state").innerHTML = "YOU HAVE LOST.";
                return;
            }
        }
    }
}

function executeTeleport(piece, type) {
    board[piece.index[1]][piece.index[0]] = 0;
    do {
        piece.index = [Math.floor(Math.random() * board.length), Math.floor(Math.random() * board.length)];
    } while(board[piece.index[1]][piece.index[0]] != 0); //Find empty index

    board[piece.index[1]][piece.index[0]] = type;

    piece.pattern = piece.index;

    monsters = monsters.map(monster => createMonster(monster.type, monster.index[0], monster.index[1], monster.pattern));
    players = players.map(player => createPlayer(player.name, player.index[0], player.index[1], player.pattern));
}

function teleportPiece(piece, auto, type) {
    let count = 1;
    let on = false;
    if(auto) {
        executeTeleport(piece, type);

        return true;
    }
    for(let i = 0; i < piece.pattern.length - 2; i++) {
        if(JSON.stringify(piece.pattern[i]) == JSON.stringify(piece.pattern[i+2]))
        {
            if(on) {
                on = false;
                count++;
            }
            else {
                on = true;
            }
        }
        else {
            count = 1;
        }

        if(count >= 3 && on) {
            executeTeleport(piece, type);

            return true;
        }
    }

    return false;
}

function menu() {
    document.getElementById("menu").hidden = false;
    document.getElementById("game").hidden = true;
    document.getElementById("finish").style.display = "none";
}

//global Variables
const field = 8;

var board;
var players;
var index;
var tokens;
var monsters;
var turn;
var playersD;

var audio;

/*function main() {
    shiftIndex(board, index,0,0, document.getElementById("board"));
}

main();*/