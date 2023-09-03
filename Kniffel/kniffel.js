

//__________________________________________________Check SessionStorage before displaying__________________________________________________

document.addEventListener("DOMContentLoaded", function() {

    if(sessionStorage.getItem(sessionStorage_players)) {

        players = JSON.parse(sessionStorage.getItem(sessionStorage_players));
        gameAttributes = JSON.parse(sessionStorage.getItem(sessionStorage_gameAttributes));

        if(players.isNaN) {
            window.location.href = "./game/game.html";
        } else {
            window.location.href = "./enternames/enternames.html";
        }

    }

    document.getElementById("application").style.display = "block";

}, false);





//__________________________________________________After player and column input__________________________________________________

function next() {

    const playercount = document.getElementById("players").value;
    gameAttributes = createGameAttributes(document.getElementById("columns").value);

    if(isNaN(playercount) || isNaN(gameAttributes.Columns) || playercount == 0 || gameAttributes.Columns == 0 || playercount > 16 || gameAttributes.Columns > 10) {return;}

    sessionStorage.setItem(sessionStorage_players, playercount);
    sessionStorage.setItem(sessionStorage_gameAttributes, JSON.stringify(gameAttributes));

    window.location.href = "./enternames/enternames.html";

}

function switchToSelectSession() {

    window.location.href = "./selectsession/selectsession.html";

}
