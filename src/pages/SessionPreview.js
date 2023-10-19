

import '../App.css'
import './css/SessionPreview.css'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearSessionStorage, resizeEvent, sessionStorage_attributes, sessionStorage_players, formatDate } from './utils'
import useAxiosPrivate from '../hooks/useAxiosPrivate'


function SessionPreview() {
	
	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const players = JSON.parse(sessionStorage.getItem(sessionStorage_players))
	const attributes = JSON.parse(sessionStorage.getItem(sessionStorage_attributes))
	const [finalScores, setFinalScores] = useState()
	
	
	
	
	
	// function resizeTable() {
	
	// 	const t = document.getElementById('winCountPreview').querySelectorAll('td')
	// 	let max_width = t[0].offsetWidth
	
	// 	for(let i = 1; t.length / 2 > i; i++) {
	// 		const tmp_width = t[i].offsetWidth
	// 		if(tmp_width > max_width) {max_width = tmp_width}
	// 	}
	
	// 	for(let i = 1; t.length / 2 > i; i++) {
	// 		t[i].style.width = max_width + 'px'
	// 	}
	
	// 	const up = winCountPreview_Players.querySelectorAll('td')
	// 	const bottom = finalScorePreview.querySelectorAll('td')
	// 	for(let i = 0; up.length > i; i++) {
	// 		const width = window.getComputedStyle(up[i]).width
	// 		up[i].style.minWidth = width
	// 		bottom[i].style.minWidth = width
	// 	}
	
	// }

	

	

	useEffect(() => {
		
		axiosPrivate.get('/sessionpreview',
			{
				headers: { 'Content-Type': 'application/json' },
				params: { SessionName: attributes.SessionName },
				withCredentials: true
			}
		).then((res) => {
			setFinalScores(JSON.parse(res.data))
		})

		resizeEvent()

	}, [])
	
	const back = () => {
	
		clearSessionStorage()
		navigate('/selectsession', { replace: true })
	
	}

	const next = () => {navigate('/game', { replace: true })}

	const firstColumnWidth = '150px'
	const firstColumnStyle = { width: firstColumnWidth, maxWidth: firstColumnWidth, padding: '5px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
	const columnWidth = players.length > 8 ? '75px' : (players.length > 4 ? '125px' : '200px')
	const style = { width: columnWidth, maxWidth: columnWidth, padding: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }




	return (
		<>
			<table className='table'>
				<tbody>
					<tr>
						<td style={firstColumnStyle}>Spieler</td>
						{players.map((p, i) => (
							<td key={i} style={style}>{p.Name}</td>
						))}
					</tr>
					<tr>
						<td style={firstColumnStyle}>Gewonnen</td>
						{players.map((p, i) => (
							<td key={i} style={style}>{p.Wins}</td>
						))}
					</tr>
				</tbody>
			</table>

			<table className='table'>
				<tbody>
					{finalScores && finalScores.map((fs, i) => (
						<tr key={i}>
							<td style={firstColumnStyle}>{formatDate(fs.Played)}</td>
							{players.map((p, j) => (
								<td key={`${i}.${j}`} style={style}>{fs[p.Alias]}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
				
			<div className='button-container'>
				<button className='button' onClick={back}>Zurück</button>
				<button className='button' onClick={next}>Los geht's!</button>
			</div>
		</>
	)
}

export default SessionPreview
