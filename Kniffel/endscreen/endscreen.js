

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("application").style.display = "block";

    if(isTest()) {

        initTestData();

    }else {

        players = JSON.parse(sessionStorage.getItem(sessionStorage_players));
        gameAttributes = JSON.parse(sessionStorage.getItem(sessionStorage_gameAttributes));

        const winnerIndex = JSON.parse(sessionStorage.getItem(sessionStorage_winner));

        if(winnerIndex == null) {
            window.location.href = "../game/game.html";
        }

        document.getElementById("winner").textContent = winnerIndex;

        initWinsTable();

    } 

}, false);





function initTestData() {

    const winner = document.getElementById("winner");
    winner.textContent = "Player_0.5";

    const playersRow = document.getElementById("players");
    const winsRow = document.getElementById("wins");

    const tmpPlayer = ["Player_0", "Player_1", "Player_2", "Player_3"];
    const tmpWins = [2, 4, 3, 3];

    for(const p of tmpPlayer) {

        const pElement = document.createElement("td");
        pElement.textContent = p;
        playersRow.appendChild(pElement);

    }

    for(const w of tmpWins) {

        const wElement = document.createElement("td");
        wElement.textContent = w;
        winsRow.appendChild(wElement);

    }

}





function initWinsTable() {

    const playersRow = document.getElementById("players");
    const winsRow = document.getElementById("wins");

    for(let i = 0; players.length > i; i++) {

        const pElement = document.createElement("td");
        pElement.textContent = players[i].Name;
        playersRow.appendChild(pElement);

        const wElement = document.createElement("td");
        wElement.textContent = players[i].Wins;
        winsRow.appendChild(wElement);

    }

}





function ok() {
    
    clearSessionStorage();
    window.location.href = "../kniffel.html";

}
