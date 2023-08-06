

let players = [];
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

        players = JSON.parse(sessionStorage.getItem(sessionStorageSubstring + "players"));
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

function next() {

    let players = document.getElementById("players").value;
    columns = document.getElementById("columns").value;

    if(isNaN(players) || isNaN(columns) || players == 0 || columns == 0) {return}

    for(let i = 0; players > i; i++){addEnterNamesAndSelectColorElement(i);}
    document.getElementById("enterPlayerAndColumnCountInterface").style.display = "none";
    document.getElementById("enterNamesInterface").style.display = "block";

}

function play() {
    
    const enterNamesElement = document.getElementsByClassName("enterNamesElement");
    for(const element of enterNamesElement) {
        const name = element.querySelector(".input").value;
        const color = element.querySelector(".colorbox").value;
        const player = {name: name, color: color};
        players.push(player);

    }

    console.log(players);

    deleteSessionStorage();

    document.getElementById("enterNamesInterface").style.display = "none";
    document.getElementById("kniffelInterface").style.display = "block";

    createTables();

    sessionStorage.setItem(sessionStorageSubstring + "players", JSON.stringify(players));
    sessionStorage.setItem(sessionStorageSubstring + "columns", columns);
    initSessionStorageTables();
    playerTable = document.getElementById(playerTable);

}

function createTables() {

    for(let p = 0; p < players.length; p++) {
        for(let c = 0; c < columns; c++) {
            addColumnToTable(c + p * columns, upperTableID, players[p].color);
            addColumnToTable(c + p * columns, bottomTableID, players[p].color);
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
    const width = columns * upperTable.rows[0].cells[2].offsetWidth;

    const nameTD = document.createElement("td");
    const nameTDLabel = document.createElement("label");
    nameTD.classList.add("playerSumElement");
    nameTD.textContent = players[i].name;
    nameTD.style.color = players[i].color;
    nameTD.style.width = width + "px";
    nameTD.appendChild(nameTDLabel);
    playerTable.querySelectorAll("tr")[0].appendChild(nameTD);

    const sumTD = document.createElement("td");
    const sumTDLabel = document.createElement("label");
    sumTD.classList.add("playerSumElement");
    sumTD.style.color = players[i].color;
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
    const placol = players.length * columns;

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

    const playerTableLabels = document.getElementById(playerTableID).querySelectorAll("label");
    const placol = players.length * columns;
    const bottomTableLabels = bottomTable.querySelectorAll("label");
    
    for(let i = 0; players.length > i; i++) {

        let sum = 0;
        for(let c = 0; columns > c; c++) {sum += Number(bottomTableLabels[c + columns * i + placol * 2].textContent);}
        playerTableLabels[i * 2 + 1].textContent = sum;

    }

}

function calculateColumn(upper, column) {

    const inputs = (Boolean(upper) ? upperTable : bottomTable).querySelectorAll("input");
    const upperLabels = upperTable.querySelectorAll("label");
    const bottomLabels = bottomTable.querySelectorAll("label");
    const placol = players.length * columns;
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
    const placol = columns * players.length;
    for(let i = 0; inputs.length > i; i++) {
        inputs[i].value = sessionStorage.getItem(sessionStorageSubstring + ID + "_" + ~~(i/placol) + "." + i%placol);
        inputEvent(inputs[i]);
    }
}

function deleteSessionStorage() {

    sessionStorage.clear();

}