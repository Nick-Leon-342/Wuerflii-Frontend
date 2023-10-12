

import '../App.css'
import './css/Game.css'

import React from 'react'
import { sessionStorage_attributes, sessionStorage_players } from './utils';


const PlayerScores = ({ players, columns }) => {
	const playerNames = ['Alice', 'Bob', 'Charlie']; // Beispiel-Spieler
  
	const renderPlayerRows = () => {
	  return playerNames.map((player, index) => {
		return (
		  <tr key={index}>
			<td>{player}</td>
			{/* Hier kannst du für jede Spalte den entsprechenden Inhalt für den Spieler einfügen */}
			<td>S1 {index}</td>
			<td>S2</td>
			{/* ... weitere Spalten für den Spieler */}
		  </tr>
		)
	  })
	}
  
	return (
		
		<tbody>
			{renderPlayerRows()}
		</tbody>
	)
};




function Games() {

	const players = JSON.parse(sessionStorage.getItem(sessionStorage_players))
	const attributes = JSON.parse(sessionStorage.getItem(sessionStorage_attributes))

	const upperTable_columns = [
		{ c:
			<tr id='nurEinserZählen' class='row'>
					<td>
						<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
						<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
						<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
					</td>
					<td>Nur Einser<br/>zählen</td>
			</tr>
		},
		{ c:
			<tr id='nurZweierZählen' class='row'>
				<td>
					<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
					<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
					<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
				</td>
				<td>Nur Zweier<br/>zählen</td>
			</tr>
		},
		{ c:
			<tr id='nurDreierZählen' class='row'>
				<td>
					<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
					<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
					<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
				</td>
				<td>Nur Dreier<br/>zählen</td>
			</tr>
		},
		{ c:
			<tr id='nurViererZählen' class='row'>
				<td>
					<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
					<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
					<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
				</td>
				<td>Nur Vierer<br/>zählen</td>
			</tr>
		},
		{ c:
			<tr id='nurFünferZählen' class='row'>
				<td>
					<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
					<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
					<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
				</td>
				<td>Nur Fünfer<br/>zählen</td>
			</tr>
		},
		{ c:
			<tr id='nurSechserZählen' class='row'>
				<td>
					<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='860' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
					<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='860' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
					<svg width='26px' height='26px' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' stroke-width='60' pointer-events='all'/><ellipse cx='860' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointer-events='all'/></svg>
				</td>
				<td>Nur Sechser<br/>zählen</td>
			</tr>
		},
		{ c:
			<tr id='gesamt'>
				<td>gesamt</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' fill='#000000' stroke='rgb(0, 0, 0)' stroke-miterlimit='10' pointer-events='all'/></svg>
				</td>
			</tr>
		},
		{ c:
			<tr id='bonusBei63OderMehr'>
				<td>Bonus bei 63<br/>oder mehr</td>
				<td>plus 35</td>
			</tr>
		},
		{ c:
			<tr id='gesamtObererTeil'>
				<td>gesamt<br/>oberer Teil</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' fill='#000000' stroke='rgb(0, 0, 0)' stroke-miterlimit='10' pointer-events='all'/></svg>
				</td>
			</tr>
		}
	]

	const bottomTable_columns = [
		{ c:
			<tr id='dreierpasch' class='row'>
				<td>Dreiferpasch</td>
				<td>alle Augen<br/>zählen</td>
			</tr>
		},
		{ c:
			<tr id='viererpasch' class='row'>
				<td>Viererpasch</td>
				<td>alle Augen<br/>zählen</td>
			</tr>
		},
		{ c:
			<tr id='full-house' class='row'>
				<td>Full-House</td>
				<td>25<br/>Punkte</td>
			</tr>
		},
		{ c:
			<tr id='kleineStraße' class='row'>
				<td>Kleine Straße</td>
				<td>30<br/>Punkte</td>
			</tr>
		},
		{ c:
			<tr id='großeStraße' class='row'>
				<td>Große Straße</td>
				<td>40<br/>Punkte</td>
			</tr>
		},
		{ c:
			<tr id='kniffel' class='row'>
				<td>Kniffel</td>
				<td>50<br/>Punkte</td>
			</tr>
		},
		{ c:
			<tr id='chance' class='row'>
				<td class='kniffelHeadElement'>Chance</td>
				<td class='kniffelHeadElement'>alle Augen<br/>zählen</td>
			</tr>
		},
		{ c:
			<tr id='gesamtUntererTeil'>
				<td>gesamt<br/>unterer Teil</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' fill='#000000' stroke='rgb(0, 0, 0)' stroke-miterlimit='10' pointer-events='all'/></svg>
				</td>
			</tr>
		},
		{ c:
			<tr id='gesamtObererTeil'>
				<td>gesamt<br/>oberer Teil</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' fill='#000000' stroke='rgb(0, 0, 0)' stroke-miterlimit='10' pointer-events='all'/></svg>
				</td>
			</tr>
		},
		{ c:
			<tr id='endsumme'>
				<td>Endsumme</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' fill='#000000' stroke='rgb(0, 0, 0)' stroke-miterlimit='10' pointer-events='all'/></svg>
				</td>
			</tr>
		}
	]

	const playerTable_columns = [
		{ c: <td>Spieler</td> },
		{ c: <td>Spieler gesamt</td>},
		{ c: <td>Gnadenwurf</td>}
	]

	const PlayerTable = () => {
		return (
			<>
				<tr>
					{playerTable_columns[0].c}
					{players.map((player) => (
						<td>{player.Name}</td>
					))}
				</tr>
				<tr>
					{playerTable_columns[1].c}
					{players.map(() => (
						<td>0</td>
					))}
				</tr>
				<tr>
					{playerTable_columns[2].c}
					{players.map((player) => (
						<td>Checkbox</td>
					))}
				</tr>
			</>
		)
	}

	return (<>
		{/* <div>
		  <table id='bottomTable' className='table bottomTable'>
			<thead>
			  <tr>
				<th>Spieler</th>
				<th>Spalte 1</th>
				<th>Spalte 2</th>
			  </tr>
			</thead>
			<PlayerScores numPlayers={players.length} />
		  </table>
		</div> */}

		<table className='table playerTable'>
			<tbody>
				<PlayerTable />
			</tbody>
		</table>

		{ /* <>

			<table id='playerTable' class='table'></table>
			<table id='upperTable' class='table upperTable'></table>



			<table id='bottomTable' class='table bottomTable'></table>

			<button onclick={newGame}class='button'>Neues Spiel</button>
			<button onclick={saveResults} class='button'>Spiel beenden</button> 
		</> */}</>
	)
}

export default Games


















// const upperTable  = document.getElementById(id_upperTable)
	// const bottomTable = document.getElementById(id_bottomTable)
	
	// let columnsSum = []
	
	
	// document.addEventListener('DOMContentLoaded', function() {
	// 	document.getElementById('application').style.display = 'block'
	
	
	// 		const playercount = sessionStorage.getItem(sessionStorage_players)
	
	// 		if(playercount) {
	
	// 			players = JSON.parse(playercount)
	// 			if(players.isNaN) {
	// 				window.location.replace('/enternames')
	// 			}
	
	// 			gameAttributes = JSON.parse(sessionStorage.getItem(sessionStorage_gameAttributes))
	
	// 			createTables()
	// 			loadTables()
	
	// 			resizeEvent()
	
	// 		} else {
	// 			window.location.replace('/creategame')
	// 		}
	
	// 	playerTable.querySelectorAll('.checkbox').forEach(function(element) {
	// 		element.addEventListener('change', function() {
		
	// 			const checks = []
	// 			for(let i = 0; players.length > i; i++) {
	// 				checks.push(playerTable.querySelectorAll('tr')[2].querySelectorAll('.checkbox')[i].checked)
	// 			}
	// 			sessionStorage.setItem(sessionStorage_gnadenwurf, JSON.stringify(checks))
		
	// 		})
	// 	})
	
	// }, false)

	// function initGame() {
	
	// 	sessionStorage.clear()
	
	// 	createTables()
	
	// 	sessionStorage.setItem(sessionStorage_players, JSON.stringify(players))
	// 	sessionStorage.setItem(sessionStorage_gameAttributes, JSON.stringify(gameAttributes))
	// 	initSessionStorageTables()
	// 	resizeEvent()
	
	// }
	
	// function createTables() {
	
	// 	for(let p = 0; p < players.length; p++) {
	// 		for(let c = 0; c < gameAttributes.Columns; c++) {
	// 			const columnCount = c + p * gameAttributes.Columns
	// 			addColumnToTable(columnCount, id_upperTable, players[p].Color)
	// 			addColumnToTable(columnCount, id_bottomTable, players[p].Color)
	// 			columnsSum.push({Upper: 0, Bottom: 0, All: 0})
	// 		}
	// 		addColumnToPlayerTable(p)
	// 	}
	
	// }
	
	
	
	
	
	// //__________________________________________________For generating Kniffel table__________________________________________________
	
	// function addColumnToPlayerTable(i) {
	
	// 	const playerTable = document.getElementById(id_playerTable)
	// 	const width = sessionStorage.getItem(sessionStorage_offsetWidth) ? sessionStorage.getItem(sessionStorage_offsetWidth) : gameAttributes.Columns * upperTable.rows[0].cells[2].offsetWidth
	// 	sessionStorage.setItem(sessionStorage_offsetWidth, width)
	
	// 	const nameTD = document.createElement('td')
	// 	nameTD.classList.add('playerSumElement')
	// 	nameTD.textContent = players[i].Name
	// 	nameTD.style.color = 'white'
	// 	nameTD.style.maxWidth = width + 'px'
	// 	nameTD.style.overflow = 'hidden'
	// 	playerTable.querySelectorAll('tr')[0].appendChild(nameTD)
	
	// 	const sumTD = document.createElement('td')
	// 	const sumTDLabel = document.createElement('label')
	// 	sumTD.classList.add('playerSumElement')
	// 	sumTD.style.color = 'white'
	// 	sumTD.style.width = width + 'px'
	// 	sumTD.style.overflow = 'hidden'
	// 	sumTD.appendChild(sumTDLabel)
	// 	playerTable.querySelectorAll('tr')[1].appendChild(sumTD)
	
	// 	const gnadenwurfTD = document.createElement('td')
	// 	const box = document.createElement('input')
	// 	box.classList.add('checkbox')
	// 	box.type = 'checkbox'
	// 	box.setAttribute = i
	// 	gnadenwurfTD.appendChild(box)
	// 	playerTable.querySelectorAll('tr')[2].appendChild(gnadenwurfTD)
	
	// }
	
	// function addColumnToTable(column, tableID, color) {
	
	// 	const table = document.getElementById(tableID)
	// 	const rows = table.querySelectorAll('tr')
	  
	// 	for (let i = 0; i < rows.length - 3; i++) {addRowToTable(column, tableID, rows, true, color, i)}
	// 	for(let i = rows.length - 3; i < rows.length; i++) {addRowToTable(column, tableID, rows, false, color, i)}
	
	// }
	
	// function addRowToTable(column, tableID, rows, input, color, i) {
	
	// 	const td = document.createElement('td')
	// 	let element
	
	// 	if(Boolean(input)) {element = document.createElement('input')
	// 	}else{element = document.createElement('label')}
	// 	element.classList.add('kniffelInput')
	// 	element.type = 'text'
	// 	element.inputMode = 'numeric'
	// 	element.style.backgroundColor = color
	// 	element.setAttribute('data-tableid', tableID)
	// 	element.setAttribute('data-column', column)
	// 	element.setAttribute('data-row', i)
	// 	element.onblur = function() {onblurEvent(element)}
	// 	element.oninput = function() {inputEvent(element)}
	// 	td.style.backgroundColor = color
	// 	td.appendChild(element)
	// 	rows[i].appendChild(td)
	
	// 	element.addEventListener('focus', function() {focusEvent(element)})
	// 	element.addEventListener('blur', function() {removeFocusEvent(element)})
	
	// }
	
	// function onblurEvent(element) {
	
	// 	const id = element.getAttribute('data-tableid')
	// 	const column = Number(element.getAttribute('data-column'))
	
	// 	saveElement(
	// 		id, 
	// 		element.value, 
	// 		column, 
	// 		Number(element.getAttribute('data-row')))
	
	// 	if(id == id_upperTable) {
	// 		calculateUpperColumn(column)
	// 	} else {
	// 		calculateBottomColumn(column)
	// 	}
		
	// }
	
	// function inputEvent(element) {
	
	// 	if (isNaN(parseFloat(element.value)) || !isFinite(element.value) || element.value.length > 2) {
	// 		element.value = element.value.slice(0, -1)
	// 	}
	
	// }
	
	// function focusEvent(element) {
	
	// 	const h = 'highlighted'
	
	// 	const r = element.closest('tr')
	// 	if(!r.classList.contains(h)) {
	// 		r.classList.add(h)
	// 	}
	
	// 	removeFocusEvent(r)
	
	// }
	
	// function removeFocusEvent(r) {
	
	// 	const h = 'highlighted'
	
	// 	const u = document.getElementById(id_upperTable).rows
	// 	for(const e of u) {
	// 		if(e != r) {e.classList.remove(h)}
	// 	}
	
	// 	const b = document.getElementById(id_bottomTable).rows
	// 	for(const e of b) {
	// 		if(e != r) {e.classList.remove(h)}
	// 	}
	
	// }
	
	
	
	
	
	// //__________________________________________________Calculating and endgame__________________________________________________
	
	// function calculateUpperColumn(columnIndex) {
	
	// 	const column = upperTable.querySelectorAll(`[data-column='${columnIndex}']`)
	
	// 	let columnCompleted = true
	// 	let sum = 0
	
	// 	for(let i = 0; 6 > i; i++) {
	
	// 		const n = column[i].value
	// 		if(n == '') {
	// 			columnCompleted = false
	// 		} else {
	// 			sum += Number(n)
	// 		}
	
	// 	}
	
	// 	const bottomLabels = bottomTable.querySelectorAll(`label[data-column='${columnIndex}']`)
	// 	column[6].textContent = sum
	// 	if(Boolean(columnCompleted)) {
	
	// 		sum = sum >= 63 ? sum + 35 : sum
	// 		column[7].textContent = sum >= 63 ? 35 : '-'
	// 		column[8].textContent = sum
			
	// 		bottomLabels[1].textContent = sum
			
	// 	} else {
	
	// 		column[7].textContent = ''
	// 		column[8].textContent = ''
	// 		bottomLabels[1].textContent = ''
	
	// 	}
	
	// 	calculateBottomLabels(columnIndex, bottomLabels)
	// 	columnsSum[columnIndex].Upper = sum
	// 	calculateScores()
	
	// }
	
	// function calculateBottomColumn(columnIndex) {
	
	// 	const column = bottomTable.querySelectorAll(`[data-column='${columnIndex}']`)
	
	// 	let columnCompleted = true
	// 	let sum = 0
	
	// 	for(let i = 0; 7 > i; i++) {
	
	// 		const n = column[i].value
	// 		if(n == '') {
	// 			columnCompleted = false
	// 		} else {
	// 			sum += Number(n)
	// 		}
	
	// 	}
	
	// 	if(Boolean(columnCompleted)) {
	
	// 		column[7].textContent = sum
			
	// 	} else {
	
	// 		column[7].textContent = ''
	// 		column[9].textContent = ''
	
	// 	}
	
	// 	calculateBottomLabels(columnIndex, bottomTable.querySelectorAll(`label[data-column='${columnIndex}']`))
	// 	columnsSum[columnIndex].Bottom = sum
	// 	calculateScores()
	
	// }
	
	// function calculateBottomLabels(columnIndex, bottomLabels) {
	
	// 	const up = Number(bottomLabels[0].textContent)
	// 	const bottom = Number(bottomLabels[1].textContent)
	// 	const sum = up + bottom
	
	// 	bottomLabels[2].textContent = up != 0 && bottom != 0 ? sum : ''
	// 	columnsSum[columnIndex].All = Number(bottomLabels[2].textContent)
	
	// }
	
	// function calculateScores() {
	
	// 	const playerTableLabels = document.getElementById(id_playerTable).querySelectorAll('label')
		
	// 	for(let i = 0; players.length > i; i++) {
	
	// 		let sum = 0
	// 		for(let c = 0; gameAttributes.Columns > c; c++) {
	
	// 			const column = columnsSum[c + i * gameAttributes.Columns]
	// 			if(column.All != 0) {
	// 				sum += column.All
	// 			} else {
	// 				sum += column.Upper + column.Bottom
	// 			}
	
	// 		}
	// 		playerTableLabels[i].textContent = sum
	
	// 	}
	
	// }
	
	
	
	
	
	
	// //__________________________________________________SessionStorage__________________________________________________
	
	// function saveElement(tableID, value, column, row) {
	
	// 	sessionStorage.setItem((tableID == id_upperTable ? sessionStorage_upperTable_substring : sessionStorage_bottomTable_substring) + row + '.' + column, value)
	
	// }
	  
	// function loadTables() {
	
	// 	const checks = JSON.parse(sessionStorage.getItem(sessionStorage_gnadenwurf))
	// 	if(checks) {
	// 		for(let i = 0; checks.length > i; i++) {
	// 			playerTable.querySelectorAll('tr')[2].querySelectorAll('.checkbox')[i].checked = checks[i]
	// 		}
	// 	}
	// 	loadTablesHelp(upperTable.querySelectorAll('input'), id_upperTable)
	// 	loadTablesHelp(bottomTable.querySelectorAll('input'), id_bottomTable)
		
	// }
	
	// function loadTablesHelp(inputs, tableID) {
	
	// 	const placol = gameAttributes.Columns * players.length
	
	// 	for(let i = 0; inputs.length > i; i++) {
	// 		inputs[i].value = sessionStorage.getItem((tableID == id_upperTable ? sessionStorage_upperTable_substring : sessionStorage_bottomTable_substring) + ~~(i/placol) + '.' + i%placol)
	// 		onblurEvent(inputs[i])
	// 	}
	
	// }
	
	
	
	
	
	// //____________________SaveResults____________________
	
	// async function saveResults() {
	
	// 	for(const element of columnsSum) {
	// 		if(element.All == 0) {
	// 			window.alert('Bitte alle Werte eingeben!')
	// 			return
	// 		}
	// 	}
		
	// 	if(players.length >= 2) {
	
	// 		if(gameAttributes.SessionName == '') {
	
	// 			const response = await fetch('/sessionnamerequest', {
	// 				method: 'POST',
	// 				headers: { 'Content-Type': 'application/json' },
	// 				body: null
	// 			})
	
	// 			const data = await response.json()
	// 			gameAttributes.SessionName = data.SessionName
	
	// 		} 
	// 		sendResults()
	
	// 	} else {
	// 		window.location.replace('/creategame')
	// 	}
	
	// }
	
	// async function sendResults() {
	
	// 	//____________________Players____________________
	// 	const tmp_playerScores = document.getElementById(id_playerTable).querySelectorAll('label')
	// 	const playerScores = []
	// 	for(let i = 0; tmp_playerScores.length > i; i++) {playerScores.push(tmp_playerScores[i].textContent)}
	
	// 	let winnerIndex = [0] //It's possible that multiple players have the same score, therefore an array
	
	// 	for(let i = 1; players.length > i; i++) {
	// 		if(playerScores[i] != null) {
	// 			if(playerScores[i] > playerScores[winnerIndex[0]]) {
	// 				winnerIndex.length = 0
	// 				winnerIndex.push(i)
	// 			} else if (playerScores[i] == playerScores[winnerIndex[0]]) {
	// 				winnerIndex.push(i)
	// 			}
	// 		}
	// 	}
	
	// 	for(const i of winnerIndex) {players[i].Wins++}
	
	// 	sessionStorage.setItem(sessionStorage_winner, JSON.stringify(winnerIndex))
	// 	sessionStorage.setItem(sessionStorage_players, JSON.stringify(players))
	
	
	// 	//____________________GameAttributes____________________
	// 	const options = { year: 'numeric', month: 'numeric', day: 'numeric' } // 19.10.2004
	// 	gameAttributes.LastPlayed = new Date().toLocaleDateString('de-DE', options)
	
	
	// 	//____________________FinalScore____________________
	// 	const finalScores = createFinalScoreElement(playerScores)
	
	// 	console.log(finalScores)
	// 	const json = JSON.stringify({ Players: players, GameAttributes: gameAttributes, FinalScores: finalScores })
		
	// 	await fetch('/game', {
	// 		method: 'POST',
	// 		headers: { 'Content-Type': 'application/json' },
	// 		body: json
	// 	})
	
	// 	clearSessionStorageTables()
	// 	window.location.replace('/endscreen')
	
	// }
	
	
	
	
	
	// //__________________________________________________NewGame__________________________________________________
	
	// const newGame = () => {
	
	// 	clearSessionStorage()
	// 	window.location.replace('/creategame')
	
	// }