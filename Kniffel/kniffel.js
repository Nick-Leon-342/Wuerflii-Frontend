

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

}, false);





//__________________________________________________After player and column input__________________________________________________

function next() {

    const playercount = document.getElementById("players").value;
    gameAttributes = createGameAttributes(document.getElementById("columns").value);

    if(isNaN(playercount) || isNaN(gameAttributes.Columns) || playercount == 0 || gameAttributes.Columns == 0) {return;}

    sessionStorage.setItem(sessionStorage_players, playercount);
    sessionStorage.setItem(sessionStorage_gameAttributes, JSON.stringify(gameAttributes));

    window.location.href = "./enternames/enternames.html";

}

function switchToSelectSession() {

    window.location.href = "./selectsession/selectsession.html";

}





//__________________________________________________LocalStorage__________________________________________________

function initializeTestDataLocalStorage() {

    const playerAmount = Math.random() * (10 - 2) + 2;

    for(let i = 0; playerAmount > i; i++) {
        const playerLength = Math.random() * (10 - 2) + 2;
        for(let p = 0; playerLength > p; p++) {
            players.push(createPlayer("player_" + p, p%2 ? "white" : "green"));
        }
        gameAttributes = createGameAttributes(2);
        

        //____________________GameSessionNames____________________
        const gameSessionNames = localStorage.getItem(localSession_NamesList_String) != null ? JSON.parse(localStorage.getItem(localSession_NamesList_String)) : [];
        const nameForSession = findANameForSession(gameSessionNames);
        localStorage.setItem(localSession_NamesList_String, JSON.stringify(gameSessionNames));


        //____________________Players____________________
        const nameForSession_players = nameForSession + players_Substring;
        const playerScores = [];
        for(let i = 0; players.length > i; i++) {playerScores.push(~~(Math.random() * (900 - 600) + 600));}

        let winnerIndex = [0]; //It's possible that multiple players have the same score, therefore an array
    
        for(let i = 1; players.length > i; i++) {
            if(playerScores[i] != null) {
                if(playerScores[i] > playerScores[winnerIndex[0]]) {
                    winnerIndex.length = 0;
                    winnerIndex.push(i)
                } else if (playerScores[i] == playerScores[winnerIndex[0]]) {
                    winnerIndex.push(i);
                }
            }
        }
        
        for(const i of winnerIndex) {players[i].Wins++;}

        localStorage.setItem(nameForSession_players, JSON.stringify(players));


        //____________________GameAttributes____________________
        const nameForSession_gameAttributes = nameForSession + gameAttributes_Substring;
        gameAttributes.LastPlayed = new Date().toLocaleDateString;
        localStorage.setItem(nameForSession_gameAttributes, JSON.stringify(gameAttributes));


        //____________________FinalScore____________________
        const nameForSession_finalScore = nameForSession + finalScore_Substring;
        const finalScore = createFinalScoreElement(playerScores);
        const finalScoreList = localStorage.getItem(nameForSession_finalScore) != null ? JSON.parse(localStorage.getItem(nameForSession_finalScore)) : [];
        finalScoreList.push(finalScore);
        localStorage.setItem(nameForSession_finalScore, JSON.stringify(finalScoreList));

        players.length = 0;
        gameAttributes = null;
    }


}


