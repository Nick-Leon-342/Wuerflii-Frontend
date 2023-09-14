

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

        initWinner(winnerIndex);
        initWinsTable();

    }

    resizeTable();

}, false);





function resizeTable() {

    const t = document.getElementById("wins-table").querySelectorAll("td");
    let max_width = t[1].offsetWidth;
    for(let i = 1; t.length > i; i++) {
        const tmp_Width = t[i].offsetWidth;
        if(tmp_Width > max_width) {max_width = tmp_Width;}
    }

    for(const e of t) {
        e.style.width = max_width + "px";
    }

}





function initTestData() {

    const playersRow = document.getElementById("players");
    const winsRow = document.getElementById("wins");

    players = [{Name: "P_0"}, {Name: "Player_1"}, {Name: "ThisIsPlayer_2"}, {Name: "Player_3"}];
    const tmpWins = [2, 4, 4, 3];
    
    let iW = [1, 2];
    initWinner(iW);

    for(const p of players) {

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





function initWinner(winnerIndexList) {

    const w = document.getElementById("winner");

    if(winnerIndexList.length == 1) {

        w.textContent = `'${players[winnerIndexList[0]].Name}' hat gewonnen!`;

    } else {

        let winners = `'${players[winnerIndexList[0]].Name}' `;
        for(let i = 1; winnerIndexList.length > i; i++) {
            const p = `'${players[winnerIndexList[i]].Name}'`;
            if((i + 1) == winnerIndexList.length) {
                winners += ` und ${p}`;
            } else {
                winners += `, ${p}`;
            }
        }
        w.textContent = `${winners} haben gewonnen!`;

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
