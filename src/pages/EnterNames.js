

import '../App.css'
import './css/EnterNames.css'

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


function EnterNames() {

	const navigate = useNavigate()
	
	const players = Array.from({ length: sessionStorage.getItem('players') }, (_, index) => index)
	const columns = sessionStorage.getItem('columns')

	

	useEffect(() => {

		if(players.length === 0 || !columns || isNaN(columns)) {
			sessionStorage.removeItem('players')
			sessionStorage.removeItem('columns')
			return navigate('/creategame', { replace: true })
		}

	}, [])


// function play() {
    
//     const enterNamesElement = document.getElementsByClassName('enterNamesElement')
//     players.length = 0
//     //for(const element of enterNamesElement) {
//     for(let i = 0; enterNamesElement.length > i; i++) {
//         players.push(createPlayer(enterNamesElement[i].querySelector('.input').value, `Player_${i}`, enterNamesElement[i].querySelector('.colorbox').value))
//     }

//     sessionStorage.setItem(sessionStorage_players, JSON.stringify(players))

//     window.location.replace('/game')

// }



	const play = () => {

	}

	const clear = () => {
		sessionStorage.removeItem('players')
		sessionStorage.removeItem('columns')
	}

	return (
		<>
			<dl id='enterNamesList'>
				{players.map((p) => (
					<dt className='enterNamesElement' key={p}>
						<input className='input' defaultValue={`Player_${p+1}`} />
						<input className='colorbox' type='color' value={p % 2 === 0 ? '#ffffff' : '#ADD8E6'} />
					</dt>
				))}
			</dl>
			<button className='button' onClick={play}>Los!</button>
			<p className='loadGames'>
				<Link onClick={clear} to='/creategame'>Zurück</Link>
			</p>
		</>
	)
}

export default EnterNames
