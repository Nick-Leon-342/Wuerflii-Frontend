

import '../App.css'
import './css/SelectSession.css'

import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { resizeEvent } from './utils'


function SelectSession() {


	

	// let nothingInList = false

	// let players_list
	// let gameAttributes_list



	// document.getElementById('sessionList').addEventListener('click', async function(event) {if(!nothingInList) {
		
	// 	const target = event.target
	// 	if(target.tagName !== 'BUTTON') {
			
	// 		const clickedElement = target.closest('dt')
	// 		const index = clickedElement.getAttribute('gameSessionIndex')
	// 		sessionStorage.setItem(sessionStorage_players, JSON.stringify(players_list[index]))
	// 		sessionStorage.setItem(sessionStorage_gameAttributes, JSON.stringify(gameAttributes_list[index]))

	// 		window.location.replace('/sessionpreview')

	// 	} else {
			
	// 		if (window.confirm('Bist du sicher, dass du diese Session löschen möchtest?')) {
				
	// 			const sessionName = target.getAttribute('gameSessionName')
				
	// 			await fetch('/deletesession', {
	// 				method: 'POST',
	// 				headers: { 'Content-Type': 'application/json' },
	// 				body: JSON.stringify({ SessionName: sessionName })
	// 			})
		
	// 			window.location.reload()

	// 		}

	// 	}

	// }})





	// //____________________Load sessions____________________

	// async function loadAllSessions() {

	// 	const response = await fetch('/selectsession', {
	// 		method: 'POST',
	// 		headers: { 'Content-Type': 'HTML/Text' },
	// 		body: ''
	// 	})

	// 	try {
	// 		const data = await response.json()
	// 		loadAllSessionsHelp(data)
	// 	} catch {
	// 	}

	// }

	// function loadAllSessionsHelp(data) {

	// 	const sessionNames_list = data.SessionNames_List
	// 	players_list = data.Players_List
	// 	gameAttributes_list = data.GameAttributes_List
		
	// 	const list = document.getElementById('sessionList')
	// 	list.innerHTML = ''
		
	// 	for(let i = 0; sessionNames_list.length > i; i++) {
		
	// 		const players = players_list[i]
	// 		const gameAttributes = gameAttributes_list[i]
		
	// 		let elementPlayersNames = ''
	// 		for(let i = 0; players.length > i; i++) {elementPlayersNames = elementPlayersNames.concat(players[i].Name + ((i+1) == players.length ? '' : ' vs '))}
		
	// 		list.innerHTML += '<dt class="listElement" gameSessionIndex="' + i + '">' + 
	// 			'<label class="listElement-label">' + elementPlayersNames + '</label>' + 
	// 			'<div class="listElement-container">' + 
	// 			'<label class="listElement-label">' + gameAttributes.CreatedDate + '</label>' + 
	// 			'<button class="deleteGameButton" gameSessionName="' + gameAttributes.SessionName + '">X</button>' + 
	// 			'</div>' + 
	// 			'</dt>'
	// 	}
		
	// 	resizeEvent()

	// }


	const list = []
	const message = 'Es gibt noch keine Partie!'

	useEffect(() => {
		resizeEvent()
	}, [])

	return (
		<>
			<dl id='sessionList'>
				{list.length === 0 ? (
					<dt className='message'>{message}</dt>
				) : (
					<dt>Sheesh</dt>
				)}
			</dl>
			
			<p className='loadGames'>
				<Link to='/creategame'>Erstelle Spiel</Link>
			</p>
		</>
	)
}

export default SelectSession
