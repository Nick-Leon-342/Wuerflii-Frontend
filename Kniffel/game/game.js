

const upperTable  = document.getElementById(id_upperTable);
const bottomTable = document.getElementById(id_bottomTable);


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("application").style.display = "block";

    const playercount = sessionStorage.getItem(sessionStorage_players);

    if(playercount) {

        players = JSON.parse(playercount);
        if(players.isNaN) {
            window.location.href = "../enternames/enternames.html";
        }

        gameAttributes = JSON.parse(sessionStorage.getItem(sessionStorage_gameAttributes));

        createTables();
        loadTables();

        resizeEvent();

    } else {
        window.location.href = "../kniffel.html";
    }

}, false);





function initGame() {

    sessionStorage.clear();

    createTables();

    sessionStorage.setItem(sessionStorage_players, JSON.stringify(players));
    sessionStorage.setItem(sessionStorage_gameAttributes, JSON.stringify(gameAttributes));
    initSessionStorageTables();
    resizeEvent();

}

function createTables() {

    for(let p = 0; p < players.length; p++) {
        for(let c = 0; c < gameAttributes.Columns; c++) {
            addColumnToTable(c + p * gameAttributes.Columns, id_upperTable, players[p].Color);
            addColumnToTable(c + p * gameAttributes.Columns, id_bottomTable, players[p].Color);
        }
        addColumnToPlayerTable(p);
    }

}





//__________________________________________________For generating Kniffel table__________________________________________________

function addColumnToPlayerTable(i) {

    const playerTable = document.getElementById(id_playerTable);
    const width = sessionStorage.getItem(sessionStorage_offsetWidth) ? sessionStorage.getItem(sessionStorage_offsetWidth) : gameAttributes.Columns * upperTable.rows[0].cells[2].offsetWidth;
    sessionStorage.setItem(sessionStorage_offsetWidth, width);

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
    element.onblur = function(){onblurEvent(element)};
    td.style.backgroundColor = color;
    td.appendChild(element);
    rows[i].appendChild(td);

    element.addEventListener("input", function() {inputEvent(element);});

}

function onblurEvent(element) {

    const tableID = element.getAttribute("data-tableid");
    const column = Number(element.getAttribute("data-column"));
    const row = Number(element.getAttribute("data-row"));
    const inputs = (tableID == id_upperTable ? upperTable : bottomTable).querySelectorAll("input");
    const placol = players.length * gameAttributes.Columns;

    saveElement(tableID, element.value, column, row);

    for(let i = 0; inputs.length/placol > i; i++) {
        if(!Boolean(inputs[column + i*placol].value) || isNaN(inputs[column + i*placol].value)) {
            return;
        }
    }

    calculateColumn(tableID == id_upperTable, column);
    
}

function inputEvent(element) {

    if (isNaN(parseFloat(element.value)) || !isFinite(element.value) || element.value.length > 2) {
        element.value = element.value.slice(0, -1);
    }

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

    const playerTableLabels = document.getElementById(id_playerTable).querySelectorAll("label");
    
    for(let i = 0; players.length > i; i++) {

        let sum = 0;
        for(let c = 0; gameAttributes.Columns > c; c++) {sum += Number(bottomLabels[c + gameAttributes.Columns * i + placol * 2].textContent);}
        playerTableLabels[i].textContent = sum;

    }

}






//__________________________________________________SessionStorage__________________________________________________

function initSessionStorageTables() {

    let columns = gameAttributes.Columns;

    for(let c = 0; columns * players.length > c; c++) {for(let r = 0; 6 > r; r++) {
        sessionStorage.setItem(sessionStorage_upperTable_substring + r + "." + c, "");
    }}

    for(let c = 0; columns * players > c; c++) {for(let r = 0; 6 > r; r++) {
        sessionStorage.setItem(sessionStorage_bottomTable_substring + r + "." + c, "");
    }}

}

function saveElement(tableID, value, column, row) {

    sessionStorage.setItem((tableID == id_upperTable ? sessionStorage_upperTable_substring : sessionStorage_bottomTable_substring) + row + "." + column, value);

}
  
function loadTables() {

    loadTablesHelp(upperTable.querySelectorAll("input"), id_upperTable);
    loadTablesHelp(bottomTable.querySelectorAll("input"), id_bottomTable);
    
}

function loadTablesHelp(inputs, tableID) {

    const placol = gameAttributes.Columns * players.length;

    for(let i = 0; inputs.length > i; i++) {
        inputs[i].value = sessionStorage.getItem((tableID == id_upperTable ? sessionStorage_upperTable_substring : sessionStorage_bottomTable_substring) + ~~(i/placol) + "." + i%placol);
        onblurEvent(inputs[i]);
    }

}






function saveResults() {

    const playerTableLabels = document.getElementById(id_playerTable).querySelectorAll("label");
    for(let i = 0; players.length > i; i++) {if(playerTableLabels[i].textContent == "") {return;}}


    const tmp = document.getElementById(id_bottomTable).querySelectorAll("label");
    for(const element of tmp) {
        const e = element.textContent;
        if(e == "" || e == 0) {
            window.alert("Bitte alle Werte eingeben und keine Buchstaben!");
            return;
        }
    }

    
    if(players.length >= 2) {

        //____________________GameSessionNames____________________
        const gameSessionNames = localStorage.getItem(localStorage_sessionName_List) != null ? JSON.parse(localStorage.getItem(localStorage_sessionName_List)) : [];
        setLocalStorageStrings(gameSessionNames);
        localStorage.setItem(localStorage_sessionName_List, JSON.stringify(gameSessionNames));


        //____________________Players____________________
        const tmp_playerScores = document.getElementById(id_playerTable).querySelectorAll("label");
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

        localStorage.setItem(localStorage_players, JSON.stringify(players));


        //____________________GameAttributes____________________
        gameAttributes.LastPlayed = new Date().toLocaleDateString;
        localStorage.setItem(localStorage_gameAttributes, JSON.stringify(gameAttributes));


        //____________________FinalScore____________________
        const finalScore = createFinalScoreElement(playerScores);
        const finalScoreList = localStorage.getItem(localStorage_finalScores) != null ? JSON.parse(localStorage.getItem(localStorage_finalScores)) : [];
        finalScoreList.push(finalScore);
        localStorage.setItem(localStorage_finalScores, JSON.stringify(finalScoreList));



        sessionStorage.setItem("alreadySaved", true);

    }

}

//__________________________________________________NewGame__________________________________________________

function newGame() {

    clearSessionStorage();
    window.location.href = "../kniffel.html";

}



