function playerInputs() { //create inputs for player names
    var count = document.getElementById("countP");
    var list = document.getElementById("listP");
    list.innerHTML = "";
    for(let i = 0; i < count.value; i++) {
        var player = document.createElement("input");
        player.type = "text";
        player.placeholder = "Player " + (i+1);
        list.appendChild(player);
    }
}

function limit() { //Limit number of players
    var limit = document.getElementById("countP");
    if(limit.value < 1) {
        limit.value = 1;
    }

    if(limit.value > 100) {
        limit.value = 100;
    }
}

playerInputs();

document.getElementById("game").hidden = true;
document.getElementById("finish").style.display = "none";