

const upperTable  = document.getElementById(id_upperTable);
const bottomTable = document.getElementById(id_bottomTable);

let columnsSum = [];

const socket = io(ip);
const user = {Name: sessionStorage.getItem(sessionStorage_user), Token: sessionStorage.getItem(sessionStorage_token)};


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("application").style.display = "block";

    if(isTest()) {

        initTestData();

    }else {

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

    }

    playerTable.querySelectorAll(".checkbox").forEach(function(element) {
        element.addEventListener("change", function() {
    
            const checks = [];
            for(let i = 0; players.length > i; i++) {
                checks.push(playerTable.querySelectorAll("tr")[2].querySelectorAll(".checkbox")[i].checked);
            }
            sessionStorage.setItem(sessionStorage_gnadenwurf, JSON.stringify(checks));
    
        });
    });

}, false);





function initTestData() {

    let p_0 = createPlayer("Player_0", "lightblue");
    let p_1 = createPlayer("P_1", "white");
    let p_2 = createPlayer("ThisIsPlayer_2", "lightgray");
    
    players.push(p_0);
    players.push(p_1);
    players.push(p_2);

    gameAttributes = createGameAttributes(3);

    createTables();

}





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
            const columnCount = c + p * gameAttributes.Columns;
            addColumnToTable(columnCount, id_upperTable, players[p].Color);
            addColumnToTable(columnCount, id_bottomTable, players[p].Color);
            columnsSum.push({Upper: 0, Bottom: 0, All: 0});
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
    nameTD.style.color = "white";
    nameTD.style.maxWidth = width + "px";
    nameTD.style.overflow = "hidden";
    playerTable.querySelectorAll("tr")[0].appendChild(nameTD);

    const sumTD = document.createElement("td");
    const sumTDLabel = document.createElement("label");
    sumTD.classList.add("playerSumElement");
    sumTD.style.color = "white";
    sumTD.style.width = width + "px";
    sumTD.style.overflow = "hidden";
    sumTD.appendChild(sumTDLabel);
    playerTable.querySelectorAll("tr")[1].appendChild(sumTD);

    const gnadenwurfTD = document.createElement("td");
    const box = document.createElement("input");
    box.classList.add("checkbox");
    box.type = "checkbox";
    box.setAttribute = i;
    gnadenwurfTD.appendChild(box);
    playerTable.querySelectorAll("tr")[2].appendChild(gnadenwurfTD);

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
    element.onblur = function() {onblurEvent(element)};
    element.oninput = function() {inputEvent(element)};
    td.style.backgroundColor = color;
    td.appendChild(element);
    rows[i].appendChild(td);

    element.addEventListener("focus", function() {focusEvent(element)});
    element.addEventListener("blur", function() {removeFocusEvent(element)});

}

function onblurEvent(element) {

    const id = element.getAttribute("data-tableid");
    const column = Number(element.getAttribute("data-column"));

    saveElement(
        id, 
        element.value, 
        column, 
        Number(element.getAttribute("data-row")));

    if(id == id_upperTable) {
        calculateUpperColumn(column);
    } else {
        calculateBottomColumn(column);
    }
    
}

function inputEvent(element) {

    if (isNaN(parseFloat(element.value)) || !isFinite(element.value) || element.value.length > 2) {
        element.value = element.value.slice(0, -1);
    }

}

function focusEvent(element) {

    const h = "highlighted";

    const r = element.closest("tr");
    if(!r.classList.contains(h)) {
        r.classList.add(h);
    }

    removeFocusEvent(r);

}

function removeFocusEvent(r) {

    const h = "highlighted";

    const u = document.getElementById(id_upperTable).rows;
    for(const e of u) {
        if(e != r) {e.classList.remove(h);}
    }

    const b = document.getElementById(id_bottomTable).rows;
    for(const e of b) {
        if(e != r) {e.classList.remove(h);}
    }

}





//__________________________________________________Calculating and endgame__________________________________________________

function calculateUpperColumn(columnIndex) {

    const column = upperTable.querySelectorAll(`[data-column="${columnIndex}"]`);

    let columnCompleted = true;
    let sum = 0;

    for(let i = 0; 6 > i; i++) {

        const n = column[i].value;
        if(n == "") {
            columnCompleted = false;
        } else {
            sum += Number(n);
        }

    }

    const bottomLabels = bottomTable.querySelectorAll(`label[data-column="${columnIndex}"]`);
    column[6].textContent = sum;
    if(Boolean(columnCompleted)) {

        sum = sum >= 63 ? sum + 35 : sum;
        column[7].textContent = sum >= 63 ? 35 : "-";
        column[8].textContent = sum;
        
        bottomLabels[1].textContent = sum;
        
    } else {

        column[7].textContent = "";
        column[8].textContent = "";
        bottomLabels[1].textContent = "";

    }

    calculateBottomLabels(columnIndex, bottomLabels);
    columnsSum[columnIndex].Upper = sum;
    calculateScores();

}

function calculateBottomColumn(columnIndex) {

    const column = bottomTable.querySelectorAll(`[data-column="${columnIndex}"]`);

    let columnCompleted = true;
    let sum = 0;

    for(let i = 0; 7 > i; i++) {

        const n = column[i].value;
        if(n == "") {
            columnCompleted = false;
        } else {
            sum += Number(n);
        }

    }

    if(Boolean(columnCompleted)) {

        column[7].textContent = sum;
        
    } else {

        column[7].textContent = "";
        column[9].textContent = "";

    }

    calculateBottomLabels(columnIndex, bottomTable.querySelectorAll(`label[data-column="${columnIndex}"]`));
    columnsSum[columnIndex].Bottom = sum;
    calculateScores();

}

function calculateBottomLabels(columnIndex, bottomLabels) {

    const up = Number(bottomLabels[0].textContent);
    const bottom = Number(bottomLabels[1].textContent);
    const sum = up + bottom;

    bottomLabels[2].textContent = up != 0 && bottom != 0 ? sum : "";
    columnsSum[columnIndex].All = Number(bottomLabels[2].textContent);

}

function calculateScores() {

    const playerTableLabels = document.getElementById(id_playerTable).querySelectorAll("label");
    
    for(let i = 0; players.length > i; i++) {

        let sum = 0;
        for(let c = 0; gameAttributes.Columns > c; c++) {

            const column = columnsSum[c + i * gameAttributes.Columns];
            if(column.All != 0) {
                sum += column.All;
            } else {
                sum += column.Upper + column.Bottom;
            }

        }
        playerTableLabels[i].textContent = sum;

    }

}






//__________________________________________________SessionStorage__________________________________________________

function saveElement(tableID, value, column, row) {

    sessionStorage.setItem((tableID == id_upperTable ? sessionStorage_upperTable_substring : sessionStorage_bottomTable_substring) + row + "." + column, value);

}
  
function loadTables() {

    const checks = JSON.parse(sessionStorage.getItem(sessionStorage_gnadenwurf));
    if(checks) {
        for(let i = 0; checks.length > i; i++) {
            playerTable.querySelectorAll("tr")[2].querySelectorAll(".checkbox")[i].checked = checks[i];
        }
    }
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




//____________________SaveResults____________________
/* 

If it's a new game the client requests a sessionname from the server.

*/

function saveResults() {

    for(const element of columnsSum) {
        if(element.All == 0) {
            window.alert("Bitte alle Werte eingeben!");
            return;
        }
    }
    
    if(players.length >= 2) {

        if(gameAttributes.SessionName == "") {
            socket.emit("sessionNameRequest", user);
        } else {
            sendResults();
        }

    } else {
        window.location.href = "../kniffel.html";
    }

}

socket.on("sessionNameRequest", data => {

    gameAttributes.SessionName = data;
    sendResults();

})

function sendResults() {

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

    sessionStorage.setItem(sessionStorage_winner, JSON.stringify(winnerIndex));
    sessionStorage.setItem(sessionStorage_players, JSON.stringify(players));


    //____________________GameAttributes____________________
    gameAttributes.LastPlayed = new Date().toLocaleDateString("de-DE");


    //____________________FinalScore____________________
    const finalScores = createFinalScoreElement(playerScores);

    
    socket.emit("saveResults", {User: user, Players: players, GameAttributes: gameAttributes, FinalScores: finalScores}, (ack) => {

        console.log("Nachricht empfangen:", ack);

    });

    clearSessionStorageTables();
    window.location.href = "../endscreen/endscreen.html";

}

//__________________________________________________NewGame__________________________________________________

function newGame() {

    clearSessionStorage();
    window.location.href = "../kniffel.html";

}



