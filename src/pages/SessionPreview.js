

import '../App.css'
import './css/SessionPreview.css'

import React from 'react'


function SessionPreview() {


	document.addEventListener('DOMContentLoaded', function() {

		if(isTest()) {
	
			//Not finished
			resizeTable();
	
		} else {
	
			requestFinalScores()
	
		}
		document.getElementById('application').style.display = 'block'
	
	}, false);
	
	let finalScores;
	
	
	
	async function requestFinalScores() {
	
		players = JSON.parse(sessionStorage.getItem(sessionStorage_players))
		gameAttributes = JSON.parse(sessionStorage.getItem(sessionStorage_gameAttributes))
	
		const response = await fetch('/sessionpreview', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ SessionName: gameAttributes.SessionName })
		})
	
		const data = await response.json()
		finalScores = data.FinalScores;
	
		initSession()
		resizeTable()
	
	}
	
	
	
	
	
	function resizeTable() {
	
		const t = document.getElementById('winCountPreview').querySelectorAll('td')
		let max_width = t[0].offsetWidth
	
		for(let i = 1; t.length / 2 > i; i++) {
			const tmp_width = t[i].offsetWidth
			if(tmp_width > max_width) {max_width = tmp_width}
		}
	
		for(let i = 1; t.length / 2 > i; i++) {
			t[i].style.width = max_width + 'px'
		}
	
		const up = winCountPreview_Players.querySelectorAll('td')
		const bottom = finalScorePreview.querySelectorAll('td')
		for(let i = 0; up.length > i; i++) {
			const width = window.getComputedStyle(up[i]).width
			up[i].style.minWidth = width
			bottom[i].style.minWidth = width
		}
	
	}
	
	
	
	
	
	function initSession() {
	
		//____________________WinCountPreview____________________
		const winCountPreview_Players = document.getElementById('winCountPreview_Players')
		const winCountPreview_Wins = document.getElementById('winCountPreview_Wins')
		winCountPreview_Players.innerHTML = '<td>Spieler</td>'
		winCountPreview_Wins.innerHTML = '<td>Gewonnen</td>'
	
		for(const player of players) {
	
			const element_player = document.createElement('td')
			element_player.textContent = player.Name
			winCountPreview_Players.appendChild(element_player)
	
			const element_wins = document.createElement('td')
			element_wins.textContent = player.Wins
			winCountPreview_Wins.appendChild(element_wins)
	
		}
	
	
		//____________________FinalScoresPreview____________________
		const finalScorePreview = document.getElementById('finalScorePreview')
		finalScorePreview.innerHTML = ''
	
		for(let f = 0; finalScores.length > f; f++) {
	
			const row = document.createElement('tr')
			row.setAttribute('index', f)
			const element_date = document.createElement('td')
			element_date.textContent = finalScores[f].gamePlayed
			row.appendChild(element_date)
	
			for(const player of players) {
	
				const element_playerCount = document.createElement('td')
				element_playerCount.textContent = finalScores[f][player.Name]
				row.appendChild(element_playerCount)
	
			}
	
			finalScorePreview.appendChild(row)
	
		}
	
	}
	
	
	
	
	
	function backToSelectSession() {
	
		clearSessionStorage();
		window.location.replace('/selectsession')
	
	}
	
	function play() {
	
		window.location.replace('/game')
	
	}

	useEffect(() => {
		resizeEvent()
	}, [])


	return (
		<div id='application'>
			<a href='https://games.mmtn-schneider.com'><button class='button'>Startseite</button></a>

			<div class='interface'>
				<table id='winCountPreview' class='table'>
					<tr id='winCountPreview_Players'></tr>
					<tr id='winCountPreview_Wins'></tr>
				</table>

				<table id='finalScorePreview' class='table'></table>
				
				<div class='button-container'>
					<button class='button' onclick='backToSelectSession()'>Zurück</button>
					<button class='button' onclick='play()'>Los geht's!</button>
				</div>
			</div>

		</div>
	)
}

export default SessionPreview
