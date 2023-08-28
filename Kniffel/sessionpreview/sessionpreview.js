


function initGameSession(gs) {

    players = gs[0];
    gameAttributes = gs[1];
    const gsn_finalScore = gameAttributes.SessionName + finalScore_Substring;
    const finalScores = JSON.parse(localStorage.getItem(gsn_finalScore));

    document.getElementById("selectExistingKniffelGame").style.display = "none";
    document.getElementById("sessionPreview").style.display = "block";


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

    for(const finalScore of finalScores) {

        const row = document.createElement("tr");
        const element_date = document.createElement("th");
        element_date.textContent = finalScore.gamePlayed;
        row.appendChild(element_date);

        for(const player of players) {

            const element_playerCount = document.createElement("th");
            element_playerCount.textContent = finalScore[player.Name];
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

    document.getElementById("sessionPreview").style.display = "none";
    document.getElementById("selectExistingKniffelGame").style.display = "block";
    loadAllGames();

}

