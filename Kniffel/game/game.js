

const upperTable  = document.getElementById(id_upperTable);
const bottomTable = document.getElementById(id_bottomTable);


document.addEventListener("DOMContentLoaded", function() {

    if(sessionStorage.getItem(sessionStorage_players)) {

        players = JSON.parse(sessionStorage.getItem(sessionStorage_players));
        gameAttributes = JSON.parse(sessionStorage.getItem(sessionStorage_gameAttributes));

        createTables();
        loadTables();

        resizeEvent();

    }

}, false);



function initGame() {

    document.getElementById("enterNamesInterface").style.display = "none";
    document.getElementById("sessionPreview").style.display = "none";
    sessionStorage.clear();
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




//__________________________________________________NewGame__________________________________________________

function newGame() {

    sessionStorage.clear();
    window.location.reload();


}


