

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("application").style.display = "block";

    if(isTest()) {



    } else {

        players = JSON.parse(sessionStorage.getItem(sessionStorage_players));
        gameAttributes = JSON.parse(sessionStorage.getItem(sessionStorage_gameAttributes));
    
        setTmpLocalStorageString(gameAttributes.SessionName);
    
        finalScores = JSON.parse(localStorage.getItem(localStorage_finalScores));
    
        initSession();

    }

    resizeTable();

}, false);

let finalScores;




function resizeTable() {

    const t = document.getElementById("winCountPreview").querySelectorAll("td");
    let max_width = t[0].offsetWidth;

    for(let i = 1; t.length / 2 > i; i++) {
        const tmp_width = t[i].offsetWidth;
        if(tmp_width > max_width) {max_width = tmp_width;}
    }

    for(let i = 1; t.length / 2 > i; i++) {
        t[i].style.width = max_width + "px";
    }

    const up = winCountPreview_Players.querySelectorAll("td");
    const bottom = finalScorePreview.querySelectorAll("td");
    for(let i = 0; up.length > i; i++) {
        const width = window.getComputedStyle(up[i]).width;
        up[i].style.minWidth = width;
        bottom[i].style.minWidth = width;
    }

}





function initSession() {

    //____________________WinCountPreview____________________
    const winCountPreview_Players = document.getElementById("winCountPreview_Players");
    const winCountPreview_Wins = document.getElementById("winCountPreview_Wins");
    winCountPreview_Players.innerHTML = "<td>Spieler</td>";
    winCountPreview_Wins.innerHTML = "<td>Gewonnen</td>";

    for(const player of players) {

        const element_player = document.createElement("td");
        element_player.textContent = player.Name;
        winCountPreview_Players.appendChild(element_player);

        const element_wins = document.createElement("td");
        element_wins.textContent = player.Wins;
        winCountPreview_Wins.appendChild(element_wins);

    }


    //____________________FinalScoresPreview____________________
    const finalScorePreview = document.getElementById("finalScorePreview");
    finalScorePreview.innerHTML = "";

    for(let f = 0; finalScores.length > f; f++) {

        const row = document.createElement("tr");
        row.setAttribute("index", f);
        const element_date = document.createElement("td");
        element_date.textContent = finalScores[f].gamePlayed;
        row.appendChild(element_date);

        for(const player of players) {

            const element_playerCount = document.createElement("td");
            element_playerCount.textContent = finalScores[f][player.Name];
            row.appendChild(element_playerCount);

        }

        finalScorePreview.appendChild(row);

    }

}





function backToSelectSession() {

    clearSessionStorage();
    window.location.href = "../selectsession/selectsession.html";

}

function play() {

    window.location.href = "../game/game.html";

}

