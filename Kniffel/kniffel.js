

let players = [];
let gameAttributes;
const gameSessionList = [];

const localSession_NamesList_String = "gameSessionNames";
const gameSession_Name_Substring = "gameSession_";
const players_Substring = "_players";
const gameAttributes_Substring = "_gameAttributes";
const finalScore_Substring = "_finalScore";

const sessionStorageSubstring = "kniffelSession_";
const upperTableID = "upperTable";
const bottomTableID = "bottomTable";
const playerTableID = "playerTable";

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

function nextEnterPAC() {

    let players = document.getElementById("players").value;
    gameAttributes = createGameAttributes(document.getElementById("columns").value);

    if(isNaN(players) || isNaN(gameAttributes.Columns) || players == 0 || gameAttributes.Columns == 0) {return;}

    for(let i = 0; players > i; i++){addEnterNamesAndSelectColorElement(i);}
    document.getElementById("enterPlayerAndColumnCountInterface").style.display = "none";
    document.getElementById("enterNamesInterface").style.display = "block";

}

function nextSelectKG() {
    document.getElementById("chooseKniffelGameList").innerHTML += "<dt class='listElement'><div class='nameOfPerson'>" + input.value + "</div><button class='xBtn'>X</button></dt>";
}

function switchEnterAndSelect(a) {

    const enter = document.getElementById("enterPlayerAndColumnCountInterface");
    const select = document.getElementById("selectExistingKniffelGame");

    if(Boolean(a)) {
        enter.style.display = "none";
        select.style.display = "block";
        loadAllGames();
    } else {
        enter.style.display = "block";
        select.style.display = "none";
    }

}

function play() {
    
    const enterNamesElement = document.getElementsByClassName("enterNamesElement");
    for(const element of enterNamesElement) {
        players.push(createPlayer(element.querySelector(".input").value, element.querySelector(".colorbox").value));
    }

    sessionStorage.clear();

    document.getElementById("enterNamesInterface").style.display = "none";
    document.getElementById("kniffelInterface").style.display = "block";

    createTables();

    sessionStorage.setItem(sessionStorageSubstring + "players", JSON.stringify(players));
    sessionStorage.setItem(sessionStorageSubstring + "gameAttributes", JSON.stringify(gameAttributes));
    initSessionStorageTables();
    resizeEvent();

}

function createTables() {

    let columns = gameAttributes.Columns;

    for(let p = 0; p < players.length; p++) {
        for(let c = 0; c < columns; c++) {
            addColumnToTable(c + p * columns, upperTableID, players[p].Color);
            addColumnToTable(c + p * columns, bottomTableID, players[p].Color);
        }
        addColumnToPlayerTable(p);
    }

}

function addEnterNamesAndSelectColorElement(i) {

    const enterNamesList = document.getElementById("enterNamesList");
    const dt = document.createElement("dt");
    const nameInput = document.createElement("input");
    const colorInput = document.createElement("input");

    dt.classList.add("enterNamesElement");
    nameInput.classList.add("input");
    nameInput.value = `Player_${i+1}`
    colorInput.classList.add("colorbox");
    colorInput.type = "color";
    colorInput.value = i % 2 == 0 ? "#ffffff" : "#ADD8E6";

    dt.appendChild(nameInput);
    dt.appendChild(colorInput);
    enterNamesList.appendChild(dt);

}





//__________________________________________________For generating Kniffel table__________________________________________________

function addColumnToPlayerTable(i) {

    const playerTable = document.getElementById(playerTableID);
    const width = sessionStorage.getItem(sessionStorageSubstring + "offsetWidth") ? sessionStorage.getItem(sessionStorageSubstring + "offsetWidth") : gameAttributes.Columns * upperTable.rows[0].cells[2].offsetWidth;
    sessionStorage.setItem(sessionStorageSubstring + "offsetWidth", width);

    const nameTD = document.createElement("td");
    nameTD.classList.add("playerSumElement");
    nameTD.textContent = players[i].Name;
    nameTD.style.color = players[i].Color;
    nameTD.style.width = width + "px";
    playerTable.querySelectorAll("tr")[0].appendChild(nameTD);

    const sumTD = document.createElement("td");
    const sumTDLabel = document.createElement("label");
    sumTD.classList.add("playerSumElement");
    sumTD.style.color = players[i].Color;
    sumTD.style.width = width + "px";
    sumTD.appendChild(sumTDLabel);
    playerTable.querySelectorAll("tr")[1].appendChild(sumTD);


}

function addColumnToTable(column, tableID, color) {

    const table = document.getElementById(tableID);
    const rows = table.querySelectorAll('tr');
  
    for (let i = 0; i < rows.length - 3; i++) {addRowToTable(column, tableID, rows, true, color, i);}
    for(let i = rows.length - 3; i < rows.length; i++) {addRowToTable(column, tableID, rows, false, color, i);}

}

function addRowToTable(column, tableID, rows, input, color, i) {

    const td = document.createElement("td");
    let element;

    if(Boolean(input)) {element = document.createElement("input");
    }else{element = document.createElement("label");}
    element.classList.add("kniffelInput");
    element.type = "text";
    element.inputMode = "numeric";
    element.style.backgroundColor = color;
    element.setAttribute("data-tableid", tableID);
    element.setAttribute("data-column", column);
    element.setAttribute("data-row", i);
    element.onblur = function(){inputEvent(element)};
    td.style.backgroundColor = color;
    td.appendChild(element);
    rows[i].appendChild(td);

}

function inputEvent(element) {

    const tableID = element.getAttribute("data-tableid");
    const column = Number(element.getAttribute("data-column"));
    const row = Number(element.getAttribute("data-row"));
    const inputs = (tableID == upperTableID ? upperTable : bottomTable).querySelectorAll("input");
    const placol = players.length * gameAttributes.Columns;

    saveElement(tableID, element.value, column, row);

    for(let i = 0; inputs.length/placol > i; i++) {
        if(!Boolean(inputs[column + i*placol].value) || isNaN(inputs[column + i*placol].value)) {
            return;
        }
    }

    calculateColumn(tableID == upperTableID, column);
    
}





//__________________________________________________Calculating and endgame__________________________________________________

function calculateColumn(upper, column) {

    const inputs = (Boolean(upper) ? upperTable : bottomTable).querySelectorAll("input");
    const upperLabels = upperTable.querySelectorAll("label");
    const bottomLabels = bottomTable.querySelectorAll("label");
    const placol = players.length * gameAttributes.Columns;
    let sum = 0;
    
    for(let i = 0; inputs.length/placol > i; i++) {
        sum = sum + Number(inputs[column + i*placol].value);
    }

    if(Boolean(upper)) {calculateUpperColumn(upperLabels, bottomLabels, column, placol, sum);
    }else{calculateBottomColumn(bottomLabels, column, placol, sum);}

}

function calculateUpperColumn(upperLabels, bottomLabels, column, placol, sum) {

    upperLabels[column].textContent = sum;
    upperLabels[column + placol].textContent = sum < 63 ? "-" : 35;
    upperLabels[column + placol * 2].textContent = sum < 63 ? sum : sum + 35;
    bottomLabels[column + placol].textContent = sum < 63 ? sum : sum + 35;
    bottomLabels[column + placol * 2].textContent = 
        bottomLabels[column].textContent == "" 
        ? ""
        : Number(bottomLabels[column + placol].textContent) + Number(bottomLabels[column].textContent);

    calculateScores(bottomLabels, placol);

}

function calculateBottomColumn(bottomLabels, column, placol, sum) {

    bottomLabels[column].textContent = sum;
    bottomLabels[column + placol * 2].textContent = 
        bottomLabels[column + placol].textContent == "" 
        ? ""
        : Number(bottomLabels[column + placol].textContent) + Number(bottomLabels[column].textContent);

    calculateScores(bottomLabels, placol);

}

function calculateScores(bottomLabels, placol) {

    const playerTableLabels = document.getElementById(playerTableID).querySelectorAll("label");
    const columns = gameAttributes.Columns;
    
    for(let i = 0; players.length > i; i++) {

        let sum = 0;
        for(let c = 0; columns > c; c++) {sum += Number(bottomLabels[c + columns * i + placol * 2].textContent);}
        playerTableLabels[i].textContent = sum;

    }

}





//__________________________________________________SessionStorage__________________________________________________

function initSessionStorageTables() {

    let columns = gameAttributes.Columns;

    for(let c = 0; columns * players.length > c; c++) {for(let r = 0; 6 > r; r++) {
        sessionStorage.setItem(sessionStorageSubstring + upperTableID + "_" + r + "." + c, "");
    }}

    for(let c = 0; columns * players > c; c++) {for(let r = 0; 6 > r; r++) {
        sessionStorage.setItem(sessionStorageSubstring + bottomTableID + "_" + r + "." + c, "");
    }}

}

function saveElement(tableID, value, column, row) {

    sessionStorage.setItem(sessionStorageSubstring + tableID + "_" + row + "." + column, value);

}
  
function loadTables() {

    loadTablesHelp(upperTable.querySelectorAll("input"), upperTableID);
    loadTablesHelp(bottomTable.querySelectorAll("input"), bottomTableID);
    
}

function loadTablesHelp(inputs, ID) {
    const placol = gameAttributes.Columns * players.length;
    for(let i = 0; inputs.length > i; i++) {
        inputs[i].value = sessionStorage.getItem(sessionStorageSubstring + ID + "_" + ~~(i/placol) + "." + i%placol);
        inputEvent(inputs[i]);
    }
}





//__________________________________________________LocalStorage__________________________________________________

function saveResults() {

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

    }

}

function findANameForSession(gameSessionNames) {

    if(gameAttributes.SessionName == "") {

        let sessionName = gameSession_Name_Substring;
        let i = 0;
        while(gameSessionNames.includes(sessionName + i)) {i++;}
        sessionName = sessionName + i;
        gameSessionNames.push(sessionName);
        gameAttributes.SessionName = sessionName;
        sessionStorage.setItem(sessionStorageSubstring + "gameAttributes", JSON.stringify(gameAttributes));
        return sessionName;

    } else {
        return gameAttributes.SessionName;
    }

}

function loadAllGames() {

    const gameSessionNames = JSON.parse(localStorage.getItem(localSession_NamesList_String));
    gameSessionList.length = 0;
    document.getElementById("chooseKniffelGameList").innerHTML = "";

    for(let i = 0; gameSessionNames.length > i; i++) {

        const players = JSON.parse(localStorage.getItem(gameSessionNames + players_Substring));
        const gameAttributes = JSON.parse(localStorage.getItem(gameSessionNames + gameAttributes_Substring));
        const tmp = [players, gameAttributes];
        gameSessionList.push(tmp);

        let elementPlayersNames = "";
        for(let i = 0; element.length > i; i++) {elementPlayersNames = elementPlayersNames.concat(players[i].Name + ((i+1) == players.length ? "" : " vs "));}

        document.getElementById("chooseKniffelGameList").innerHTML += "<dt class='listElement' gameSessionIndex='" + i + "'>" + 
            "<label class='listElement-label'>" + elementPlayersNames + "</label>" + 
            "<div class='listElement-container'>" + 
            "<label class='listElement-label'>${gameAttributes.CreatedDate}</label><button class='deleteGameButton'>X</button>" + 
            "</div>" + 
            "</dt>";
    }

}

function initGameSession(gs) {

    gameAttributes = gs.pop();
    players = gs;


}

function initListTestData() {

    const s_0 = "savedGame-0";
    const s_1 = "savedGame-1";

    const p_0 = ["Eins", "Zwei", "Drei", "Vier", "Fünf"];
    const p_1 = ["Ölf", "Zwölf", "Drölf"];

    const a_0 = ["Eins_Wins", "Zwei_Wins", "Drei_Wins", "Vier_Wins", "Fünf_Wins", 2, "19/10/2004", s_0];
    const a_1 = ["Ölf_Wins", "Zwölf_Wins", "Drölf_Wins", 5, "31/12/2000", s_1];

    p_0.push(JSON.stringify(a_0));
    p_1.push(JSON.stringify(a_1));

    const n = [s_0, s_1];

    localStorage.setItem(gameSessionNamesString, JSON.stringify(n));
    localStorage.setItem(s_0, JSON.stringify(p_0));
    localStorage.setItem(s_1, JSON.stringify(p_1));

}

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





//__________________________________________________NewGame__________________________________________________

function newGame() {

    sessionStorage.clear();
    window.location.reload();


}







window.addEventListener("resize", resizeEvent);

function resizeEvent() {
    const kA = document.getElementById("kniffelApplication");
    const body = document.body;

    if (kA.offsetWidth >= this.window.innerWidth) {
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
}

document.getElementById("chooseKniffelGameList").addEventListener("click", function(event) {
    
    const target = event.target;
    if(target.tagName !== "BUTTON") {
        
        const clickedElement = target.closest("dt");
        const gsn = clickedElement.getAttribute("gameSessionIndex");
        initGameSession([...gameSessionList[gsn]]);

    }

});