

let players = [];
let gameAttributes;



//____________________IDs____________________

const id_upperTable                         = 'upperTable';
const id_bottomTable                        = 'bottomTable';
const id_playerTable                        = 'playerTable';


//____________________Substrings____________________

const substring_players                     = 'players';
const substring_gameAttributes              = 'gameAttributes';
const substring_finalScore                  = 'finalScore';

const substring_gnadenwurf                  = 'gnadenwurf';
const substring_offsetWidth                 = 'offsetWidth';
const substring_winner                      = 'winner';

const substring_gameSession                 = 'gameSession_';


//____________________SessionStorage____________________

const substring_sessionStorage              = 'kniffel_sessionStorage_';
const sessionStorage_players                = substring_sessionStorage + substring_players;
const sessionStorage_gameAttributes         = substring_sessionStorage + substring_gameAttributes;

const sessionStorage_gnadenwurf             = substring_sessionStorage + substring_gnadenwurf;
const sessionStorage_offsetWidth            = substring_sessionStorage + substring_offsetWidth;
const sessionStorage_winner                 = substring_sessionStorage + substring_winner;

const sessionStorage_upperTable_substring   = substring_sessionStorage + id_upperTable + '_';
const sessionStorage_bottomTable_substring  = substring_sessionStorage + id_bottomTable + '_';





//____________________ClearStorage____________________

function clearSessionStorage() {

    cSS(substring_sessionStorage);

}

function clearSessionStorageTables() {

    cSS(sessionStorage_upperTable_substring);
    cSS(sessionStorage_bottomTable_substring);

}

function cSS(substring) {

    const sessionStorage_Keys = [];

    for(let i = 0; i < sessionStorage.length; i++) {sessionStorage_Keys.push(sessionStorage.key(i));}
    
    for(const key of sessionStorage_Keys) {
        if (key.includes(substring)) {
            sessionStorage.removeItem(key);
        }
    }

}





//____________________CreateObjects____________________

function createPlayer(name, alias, color) {
    return {
        Name: name,
        Alias: alias,
        Color: color,
        Wins: 0
    };
}

function createGameAttributes(columns) {
    return {
        Columns: columns,
        LastPlayed: new Date().toLocaleDateString(),
        CreatedDate: new Date().toLocaleDateString(),
        SessionName: ''
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

window.addEventListener('resize', resizeEvent);

function resizeEvent() {

    const kA = document.getElementById('application');
    const body = document.body;

    if(kA.offsetWidth >= this.window.innerWidth) {
        body.style.justifyContent = 'left';
        kA.style.borderRadius = '0px';
        kA.style.marginTop = '10px';
        kA.style.marginBottom = '10px';
    } else {
        body.style.justifyContent = 'center';
        kA.style.borderRadius = '20px';
        kA.style.marginTop = '0px';
        kA.style.marginBottom = '0px';
    }

    if(kA.offsetHeight >= this.window.innerHeight) {
        body.style.height = '100%';
    } else {
        body.style.height = '100vh';
    }
    
}




function isTest() {

    const parameter = new URLSearchParams(window.location.search).get('test');
    return parameter == 'true';

}






function checkCredentials(name, password) {
    return name != '' && password != ''
}
