

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("application").style.display = "block";
    players = JSON.parse(sessionStorage.getItem(sessionStorage_players));
    gameAttributes = JSON.parse(sessionStorage.getItem(sessionStorage_gameAttributes));

    setTmpLocalStorageString(gameAttributes.SessionName);

    finalScores = JSON.parse(localStorage.getItem(localStorage_finalScores));

    initSession();
    

}, false);

let finalScores;





function initSession() {

    //____________________WinCountPreview____________________
    const winCountPreview_Players = document.getElementById("winCountPreview_Players");
    const winCountPreview_Wins = document.getElementById("winCountPreview_Wins");
    winCountPreview_Players.innerHTML = "<th>Spieler</th>";
    winCountPreview_Wins.innerHTML = "<th>Gewonnen</th>";

    for(const player of players) {

        const element_player = document.createElement("th");
        element_player.textContent = player.Name;
        winCountPreview_Players.appendChild(element_player);

        const element_wins = document.createElement("th");
        element_wins.textContent = player.Wins;
        winCountPreview_Wins.appendChild(element_wins);

    }


    //____________________FinalScoresPreview____________________
    const finalScorePreview = document.getElementById("finalScorePreview");
    finalScorePreview.innerHTML = "";

    for(let f = 0; finalScores.length > f; f++) {

        const row = document.createElement("tr");
        row.setAttribute("index", f);
        const element_date = document.createElement("th");
        element_date.textContent = finalScores[f].gamePlayed;
        row.appendChild(element_date);

        for(const player of players) {

            const element_playerCount = document.createElement("th");
            element_playerCount.textContent = finalScores[f][player.Name];
            row.appendChild(element_playerCount);

        }

        finalScorePreview.appendChild(row);

    }

    const up = winCountPreview_Players.querySelectorAll("th");
    const bottom = finalScorePreview.querySelectorAll("th");
    for(let i = 0; up.length > i; i++) {
        const width = window.getComputedStyle(up[i]).width;
        up[i].style.minWidth = width;
        bottom[i].style.minWidth = width;
    }

}





function backToSelectSession() {

    clearSessionStorage();
    window.location.href = "../selectsession/selectsession.html";

}

function play() {

    window.location.href = "../game/game.html";

}

