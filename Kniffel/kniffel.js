

let players;
let columns;
const sessionStorageSubstring = "kniffelSession_";
const upperTableID = "upperTable";
const bottomTableID = "bottomTable";
const playerTableID = "playerTable";
const upperTable = document.getElementById(upperTableID);
const bottomTable = document.getElementById(bottomTableID);
let playerTable;



//__________________________________________________Check SessionStorage before displaying__________________________________________________

document.addEventListener('DOMContentLoaded', function() {

    if(sessionStorage.getItem(sessionStorageSubstring + "players")) {

        players = sessionStorage.getItem(sessionStorageSubstring + "players");
        columns = sessionStorage.getItem(sessionStorageSubstring + "columns");

        createTables();
        loadTables();

        document.getElementById("kniffelInterface").style.display = "block";
        document.getElementById("kniffelApplication").style.display = "block";

    }else{
        document.getElementById("enterPlayerAndColumnCountInterface").style.display = "block";
        document.getElementById("kniffelApplication").style.display = "block";
    }

}, false);





//__________________________________________________After player and column input__________________________________________________

function play() {
    players = document.getElementById("players").value;
    columns = document.getElementById("columns").value;

    if(isNaN(players) || isNaN(columns) || players == 0 || columns == 0) {return}
    
    document.getElementById("enterPlayerAndColumnCountInterface").style.display = "none";
    document.getElementById("kniffelInterface").style.display = "block";

    createTables();

    sessionStorage.setItem(sessionStorageSubstring + "players", players);
    sessionStorage.setItem(sessionStorageSubstring + "columns", columns);
    initSessionStorageTables();
    playerTable = document.getElementById(playerTable);

}

function createTables() {
    for(let p = 0; p < players; p++) {for(let c = 0; c < columns; c++) {
        addColumnToTable(c + p * columns, upperTableID, p % 2 == 0 ? "lightblue" : "white");
        addColumnToTable(c + p * columns, bottomTableID, p % 2 == 0 ? "lightblue" : "white");
    }}
}





//__________________________________________________For generating Kniffel table__________________________________________________

function addColumnToTable(column, tableID, color) {
    const table = document.getElementById(tableID);
    const rows = table.querySelectorAll('tr');
  
    for (let i = 0; i < rows.length - 3; i++) {addRowToTable(column, tableID, rows, true, color, i);}
    for(let i = rows.length - 3; i < rows.length; i++) {addRowToTable(column, tableID, rows, false, color, i);}
}

function addRowToTable(column, tableID, rows, input, color, i) {
    const td = document.createElement('td');
    let element;

    if(Boolean(input)) {element = document.createElement("input");
    }else{element = document.createElement("label");}
    element.classList.add("kniffelInput");
    element.type = "text";
    element.inputMode = "numeric";
    element.pattern = "[1-9][0-9]*";
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
    const placol = players * columns;

    saveElement(tableID, element.value, column, row);

    for(let i = 0; inputs.length/placol > i; i++) {
        if(!Boolean(inputs[column + i*placol].value) || isNaN(inputs[column + i*placol].value)) {
            return;
        }
    }

    calculateColumn(tableID == upperTableID, column);
    
}





//__________________________________________________Calculating and endgame__________________________________________________

function finishGame() {

    const row = document.getElementById("playerSum");
    const labels = bottomTable.querySelectorAll("label");
    const playerSumWidth = columns * upperTable.rows[0].cells[2].offsetWidth;
    const placol = players * columns;

    for(let i = 0; players > i; i++) {

        const playerSum = document.createElement("td");
        const playerSumLabel = document.createElement("label");
        playerSum.classList.add("playerSumElement");
        playerSum.appendChild(playerSumLabel);
        let sum = 0;

        for(let c = 0; columns > c; c++) {
            sum += Number(labels[c + columns * i + placol * 2].textContent);
        }

        playerSumLabel.textContent = sum;
        playerSum.style.width = playerSumWidth + "px";

        row.appendChild(playerSum);

    }

}

function calculateColumn(upper, column) {

    const inputs = (Boolean(upper) ? upperTable : bottomTable).querySelectorAll("input");
    const upperLabels = upperTable.querySelectorAll("label");
    const bottomLabels = bottomTable.querySelectorAll("label");
    const placol = players * columns;
    let sum = 0;
    
    for(let i = 0; inputs.length/placol > i; i++) {
        sum = sum + Number(inputs[column + i*placol].value);
    }

    if(Boolean(upper)) {calculateUpperColumn(inputs, upperLabels, bottomLabels, column, placol, sum);
    }else{calculateBottomColumn(inputs, bottomLabels, column, placol, sum);}

}

function calculateUpperColumn(inputs, upperLabels, bottomLabels, column, placol, sum) {

    upperLabels[column].textContent = sum;
    upperLabels[column + placol].textContent = sum < 63 ? "-" : 35;
    upperLabels[column + placol * 2].textContent = sum < 63 ? sum : sum + 35;
    bottomLabels[column + placol].textContent = sum < 63 ? sum : sum + 35;
    bottomLabels[column + placol * 2].textContent = 
        bottomLabels[column].textContent == "" 
        ? ""
        : Number(bottomLabels[column + placol].textContent) + Number(bottomLabels[column].textContent);

}

function calculateBottomColumn(inputs, bottomLabels, column, placol, sum) {

    bottomLabels[column].textContent = sum;
    bottomLabels[column + placol * 2].textContent = 
        bottomLabels[column + placol].textContent == "" 
        ? ""
        : Number(bottomLabels[column + placol].textContent) + Number(bottomLabels[column].textContent);

}





//__________________________________________________SessionStorage__________________________________________________

function initSessionStorageTables() {

    for(let c = 0; columns * players > c; c++) {for(let r = 0; 6 > r; r++) {
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
    const placol = columns * players;
    for(let i = 0; inputs.length > i; i++) {
        inputs[i].value = sessionStorage.getItem(sessionStorageSubstring + ID + "_" + ~~(i/placol) + "." + i%placol);
        inputEvent(inputs[i]);
    }
}

function deleteSessionStorage() {

    sessionStorage.clear();

}