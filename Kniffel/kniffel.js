
function addColumn(uppertableID, bottomTableID, color) {
    addColumnToTable(uppertableID, color);
    addColumnToTable(bottomTableID, color);
}

function addColumnToTable(tableID, color) {
    const table = document.getElementById(tableID);
    const rows = table.querySelectorAll('tr');
  
    for (let i = 0; i < rows.length; i++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.name = 'row' + i + 'col';
        input.style.width = "50px";
        td.style.backgroundColor = color;
        td.appendChild(input);
        rows[i].appendChild(td);
    }
}


function play() {
    let players = document.getElementById("players").value;
    let columns = document.getElementById("columns").value;

    if(isNaN(players) || isNaN(columns) || players == 0 || columns == 0) {return}
    
    document.getElementById("enterPlayerAndColumnCountInterface").style.display = "none";
    document.getElementById("kniffelInterface").style.display = "block";
    console.log(players + " " + columns);



}
