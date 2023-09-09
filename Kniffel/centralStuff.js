

let players = [];
let gameAttributes;
const gameSessionList = [];





//____________________IDs____________________

const id_upperTable                         = "upperTable";
const id_bottomTable                        = "bottomTable";
const id_playerTable                        = "playerTable";


//____________________LocalStorage____________________

const substring_players                     = "players";
const substring_gameAttributes              = "gameAttributes";
const substring_finalScore                  = "finalScore";

const substring_offsetWidth                 = "offsetWidth";
const substring_winner                      = "winner";

const substring_gameSession                 = "gameSession_";


//____________________SessionStorage____________________

const substring_sessionStorage              = "kniffel_sessionStorage_";
const sessionStorage_players                = substring_sessionStorage + substring_players;
const sessionStorage_gameAttributes         = substring_sessionStorage + substring_gameAttributes;

const sessionStorage_offsetWidth            = substring_sessionStorage + substring_offsetWidth;
const sessionStorage_winner                 = substring_sessionStorage + substring_winner;

const sessionStorage_upperTable_substring   = substring_sessionStorage + id_upperTable + "_";
const sessionStorage_bottomTable_substring  = substring_sessionStorage + id_bottomTable + "_";


//____________________LocalStorage____________________

const substring_localStorage                = "kniffel_localStorage_";
let localStorage_defaultSring               = substring_localStorage + substring_gameSession;
let localStorage_players                    = "";
let localStorage_gameAttributes             = "";
let localStorage_finalScores                = "";
const localStorage_sessionName_List         = substring_localStorage + "sessionName_List";





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
        const gameSessionNames = localStorage.getItem(localStorage_sessionName_List) != null ? JSON.parse(localStorage.getItem(localStorage_sessionName_List)) : [];
        setLocalStorageStrings(gameSessionNames);
        localStorage.setItem(localStorage_sessionName_List, JSON.stringify(gameSessionNames));

        
        //____________________GameAttributes____________________
        gameAttributes.LastPlayed = new Date().toLocaleDateString;
        localStorage.setItem(localStorage_gameAttributes, JSON.stringify(gameAttributes));


        for(let ps = 0; (Math.random() * (12 - 2) + 2) > ps; ps++) {

            //____________________Players____________________
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

            localStorage.setItem(localStorage_players, JSON.stringify(players));




            //____________________FinalScore____________________
            const finalScore = createFinalScoreElement(playerScores);
            const finalScoreList = localStorage.getItem(localStorage_finalScores) != null ? JSON.parse(localStorage.getItem(localStorage_finalScores)) : [];
            finalScoreList.push(finalScore);
            localStorage.setItem(localStorage_finalScores, JSON.stringify(finalScoreList));

        }

        players.length = 0;
        gameAttributes = null;
    }


}





function setLocalStorageStrings(gameSessionNames) {

    const lastChar = localStorage_defaultSring.charAt(localStorage_defaultSring.length - 1);
    if(!isNaN(lastChar)) {localStorage_defaultSring = localStorage_defaultSring.slice(0, -1);}

    if(gameAttributes.SessionName == "") {

        let i = 0;
        while(gameSessionNames.includes(localStorage_defaultSring + i)) {i++;}

        localStorage_defaultSring = localStorage_defaultSring + i;

        gameSessionNames.push(localStorage_defaultSring);
        gameAttributes.SessionName = localStorage_defaultSring;
        sessionStorage.setItem(sessionStorage_gameAttributes, JSON.stringify(gameAttributes));

    } else {
        
        localStorage_defaultSring = gameAttributes.SessionName;

    }

    setPlayersGameAttributesFinalScoresString();

}

function setTmpLocalStorageString(sessionName) {

    localStorage_defaultSring = sessionName;
    setPlayersGameAttributesFinalScoresString();

}

function setPlayersGameAttributesFinalScoresString() {
    
    localStorage_players                = localStorage_defaultSring + "_" + substring_players;
    localStorage_gameAttributes         = localStorage_defaultSring + "_" + substring_gameAttributes;
    localStorage_finalScores            = localStorage_defaultSring + "_" + substring_finalScore;

}

function clearSessionStorage() {

    const sessionStorage_Keys = [];

    for(let i = 0; i < sessionStorage.length; i++) {sessionStorage_Keys.push(sessionStorage.key(i));}
    
    for(const key of sessionStorage_Keys) {
        if (key.includes(substring_sessionStorage)) {
            sessionStorage.removeItem(key);
        }
    }

}

function clearLocalStorage() {

}





//____________________CreateObjects____________________

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





//____________________ResizeEvent____________________

window.addEventListener("resize", resizeEvent);

function resizeEvent() {

    const kA = document.getElementById("application");
    const body = document.body;

    if(kA.offsetWidth >= this.window.innerWidth) {
        body.style.justifyContent = "left";
        kA.style.borderRadius = "0px";
        kA.style.marginTop = "10px";
        kA.style.marginBottom = "10px";
    } else {
        body.style.justifyContent = "center";
        kA.style.borderRadius = "20px";
        kA.style.marginTop = "0px";
        kA.style.marginBottom = "0px";
    }

    if(kA.offsetHeight >= this.window.innerHeight) {
        body.style.height = "100%";
    } else {
        body.style.height = "100vh";
    }
    
}




function isTest() {
    const parameter = new URLSearchParams(window.location.search).get("test");
    return parameter == "true";
}
