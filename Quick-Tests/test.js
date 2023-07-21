function createScoreTable() {
    const numberOfPlayers = parseInt(document.getElementById('numberOfPlayers').value);
    const columnsPerPlayer = parseInt(document.getElementById('columnsPerPlayer').value);
  
    if (isNaN(numberOfPlayers) || isNaN(columnsPerPlayer)) {
      alert('Bitte geben Sie gültige Zahlenwerte ein.');
      return;
    }
  
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = '';
  
    const table = document.createElement('table');
    table.id = 'scoreTable';
    tableContainer.appendChild(table);
  
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Name</th>';
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
  
    for (let i = 1; i <= numberOfPlayers; i++) {
      const playerColor = prompt('Geben Sie die Hintergrundfarbe für Spieler ' + i + ' ein (z. B. "lightblue"):');
      createPlayerColumns(tbody, i, columnsPerPlayer, playerColor);
    }
  }
  
  function createPlayerColumns(tbody, playerNumber, columnsPerPlayer, playerColor) {
    const playerRow = document.createElement('tr');
    playerRow.innerHTML = '<td>Player ' + playerNumber + '</td>';
  
    for (let j = 1; j <= columnsPerPlayer; j++) {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'player' + playerNumber + 'col' + j;
      td.appendChild(input);
      playerRow.appendChild(td);
    }
  
    playerRow.style.backgroundColor = playerColor;
    tbody.appendChild(playerRow);
  }
  