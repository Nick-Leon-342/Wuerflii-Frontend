

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

const substring_gameSession                 = "gameSession_";


//____________________SessionStorage____________________

const substring_sessionStorage              = "kniffel_sessionStorage_";
const sessionStorage_players                = substring_sessionStorage + substring_players;
const sessionStorage_gameAttributes         = substring_sessionStorage + substring_gameAttributes;

const sessionStorage_offsetWidth            = substring_sessionStorage + substring_offsetWidth;

const sessionStorage_upperTable_substring   = substring_sessionStorage + id_upperTable + "_";
const sessionStorage_bottomTable_substring  = substring_sessionStorage + id_bottomTable + "_";


//____________________LocalStorage____________________

const substring_localStorage                = "kniffel_localStorage_";
const localStorage_defaultSring             = substring_localStorage + substring_gameSession;
const localStorage_players                  = "";
const localStorage_gameAttributes           = "";
const localStorage_finalScores              = "";
const localStorage_sessionName_List         = substring_localStorage + "sessionName_List";





function setLocalStorageStrings(gameSessionNames) {

    if(gameAttributes.SessionName == "") {

        let i = 0;
        while(gameSessionNames.includes(localStorage_defaultSring + i)) {i++;}

        localStorage_defaultSring += i;

        gameSessionNames.push(localStorage_defaultSring);
        gameAttributes.SessionName = localStorage_defaultSring;
        sessionStorage.setItem(sessionStorage_gameAttributes, JSON.stringify(gameAttributes));

    } else {
        
        localStorage_defaultSring = gameAttributes.SessionName;

    }

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
    const kA = document.getElementById("kniffelApplication");
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
