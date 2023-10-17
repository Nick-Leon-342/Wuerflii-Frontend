

import '../App.css'
import './css/EndScreen.css'

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { sessionStorage_players, sessionStorage_winner, clearSessionStorage, resizeEvent } from './utils'


function EndScreen() {

	const navigate = useNavigate()
	let players = JSON.parse(sessionStorage.getItem(sessionStorage_players))
	let winner = JSON.parse(sessionStorage.getItem(sessionStorage_winner))
	
	
	
	
	
	// const resizeTable = () => {
	
	// 	const t = document.getElementById('wins-table').querySelectorAll('td')
	// 	let max_width = t[1].offsetWidth
	// 	for(let i = 1; t.length > i; i++) {
	// 		const tmp_Width = t[i].offsetWidth
	// 		if(tmp_Width > max_width) {max_width = tmp_Width}
	// 	}
	
	// 	for(const e of t) {
	// 		e.style.width = max_width + 'px'
	// 	}
	
	// }
	
	
	
	
	useEffect(() => {
		resizeEvent()
	}, [])

	
	const ok = () => {
		
		clearSessionStorage()
		navigate('/creategame', { replace: true })
	
	}


	let string = `'${players[winner[0]].Name}' `
	for(let i = 1; winner.length > i; i++) {
		const p = `'${players[winner[i]].Name}'`
		if((i + 1) === winner.length) {
			string += ` und ${p} haben gewonnen!`
		} else {
			string += `, ${p}`
		}
	}


	return (
		<>
			<div className='button-container'><label className='winner'>
				{winner.length === 1 ? `'${players[winner[0]].Name}' hat gewonnen!` : `${string}`}
			</label></div>

			<br/>

			<table className='table wins'>
				<tbody>
					<tr>
						<td>Spieler</td>
						{players.map((p, i) => (
							<td key={i}>{p.Name}</td>
						))}
					</tr>
					<tr>
						<td>Gewonnen</td>
						{players.map((p, i) => (
							<td key={i}>{p.Wins}</td>
						))}
					</tr>
				</tbody>
			</table>

			<button className='button ok' onClick={ok}>Ok</button>
		</>
	)
}

export default EndScreen
