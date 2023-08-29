

let players = [];
let gameAttributes;
const gameSessionList = [];


const upperTable = document.getElementById(upperTableID);
const bottomTable = document.getElementById(bottomTableID);



//__________________________________________________Check SessionStorage before displaying__________________________________________________

document.addEventListener("DOMContentLoaded", function() {

    if(sessionStorage.getItem(sessionStorageSubstring + "players")) {

        players = JSON.parse(sessionStorage.getItem(sessionStorageSubstring + "players"));
        gameAttributes = JSON.parse(sessionStorage.getItem(sessionStorageSubstring + "gameAttributes"));

        createTables();
        loadTables();

        document.getElementById("kniffelInterface").style.display = "block";
        document.getElementById("kniffelApplication").style.display = "block";
        resizeEvent();

    }else{

        document.getElementById("enterPlayerAndColumnCountInterface").style.display = "block";
        document.getElementById("kniffelApplication").style.display = "block";

    }

}, false);





//__________________________________________________After player and column input__________________________________________________

function next() {

    let players = document.getElementById("players").value;
    gameAttributes = createGameAttributes(document.getElementById("columns").value);

    if(isNaN(players) || isNaN(gameAttributes.Columns) || players == 0 || gameAttributes.Columns == 0) {return;}

    document.getElementById("enterNamesList").innerHTML = "";
    for(let i = 0; players > i; i++){addEnterNamesAndSelectColorElement(i);}
    document.getElementById("enterPlayerAndColumnCountInterface").style.display = "none";
    document.getElementById("enterNamesInterface").style.display = "block";

}

function switchToSelectSession() {

    window.location.href = "./selectSession/selectSession.html";

}





//__________________________________________________LocalStorage__________________________________________________

function saveResults() {if(!Boolean(sessionStorage.getItem("alreadySaved"))) {

    const tmp = document.getElementById(bottomTableID).querySelectorAll("label");
    for(const element of tmp) {
        const e = element.textContent;
        if(e == "" || e == 0) {
            window.alert("Bitte alle Werte eingeben und keine Buchstaben!");
            return;
        }
    }

    if(players.length >= 2) {

        //____________________GameSessionNames____________________
        const gameSessionNames = localStorage.getItem(localSession_NamesList_String) != null ? JSON.parse(localStorage.getItem(localSession_NamesList_String)) : [];
        const nameForSession = findANameForSession(gameSessionNames);
        localStorage.setItem(localSession_NamesList_String, JSON.stringify(gameSessionNames));


        //____________________Players____________________
        const nameForSession_players = nameForSession + players_Substring;
        const tmp_playerScores = document.getElementById(playerTableID).querySelectorAll("label");
        const playerScores = [];
        for(let i = 0; tmp_playerScores.length > i; i++) {playerScores.push(tmp_playerScores[i].textContent);}

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



        sessionStorage.setItem("alreadySaved", true);

    }

}}

function createPlayer(name, color) {
    return {
        Name: name,
        Color: color,
        Wins: 0
    };
}

function createGameAttributes(columns) {
    return {
        Columns: columns,
        LastPlayed: new Date().toLocaleDateString(),
        CreatedDate: new Date().toLocaleDateString(),
        SessionName: ""
    };
}

function createFinalScoreElement(scoreList) {

    const finalScore = {
        gamePlayed: new Date().toLocaleDateString()
    };

    for(let i = 0; i < players.length; i++) {
        finalScore[players[i].Name] = scoreList[i];
    }

    return finalScore;

}

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


