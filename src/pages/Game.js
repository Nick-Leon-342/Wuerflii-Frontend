

import '../App.css'
import './css/Game.css'

import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { createFinalScoreElement, sessionStorage_winner, clearSessionStorageTables, sessionStorage_gnadenwurf, sessionStorage_upperTable_substring, sessionStorage_bottomTable_substring, sessionStorage_session, id_playerTable, id_bottomTable, id_upperTable, resizeEvent, clearSessionStorage, sessionStorage_players } from './utils'





function Games() {

	const navigate = useNavigate()
	const [columnsSum] = useState([])
	const axiosPrivate = useAxiosPrivate()
	const tableRef = useRef(null)
	const [tableWidth, setTableWidth] = useState(0);

	const session = JSON.parse(sessionStorage.getItem(sessionStorage_session))

	let gnadenwurf = session.List_Players?.map(() => false)
  
	const handleGnadenwurfChange = (index, g) => {
		gnadenwurf[index] = g
		sessionStorage.setItem(sessionStorage_gnadenwurf, JSON.stringify(gnadenwurf))
	}





	const upperTable_rows = [
		{ td:
			<>
				<td>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/></svg>
				</td>
				<td><label>Nur Einser<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				</td>
				<td><label>Nur Zweier<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				</td>
				<td><label>Nur Dreier<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				</td>
				<td><label>Nur Vierer<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				</td>
				<td><label>Nur Fünfer<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='860' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='860' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='860' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				</td>
				<td><label>Nur Sechser<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td>gesamt</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg>
				</td>
			</>
		},
		{ td:
			<>
				<td>Bonus bei 63<br/>oder mehr</td>
				<td>plus 35</td>
			</>
		},
		{ td:
			<>
				<td>gesamt<br/>oberer Teil</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg>
				</td>
			</>
		}
	]

	const bottomTable_rows = [
		{ td:
			<>
				<td><label>Dreiferpasch</label></td>
				<td><label>alle Augen<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td><label>Viererpasch</label></td>
				<td><label>alle Augen<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td><label>Full-House</label></td>
				<td><label>25<br/>Punkte</label></td>
			</>
		},
		{ td:
			<>
				<td><label>Kleine Straße</label></td>
				<td><label>30<br/>Punkte</label></td>
			</>
		},
		{ td:
			<>
				<td><label>Große Straße</label></td>
				<td><label>40<br/>Punkte</label></td>
			</>
		},
		{ td:
			<>
				<td><label>Kniffel</label></td>
				<td><label>50<br/>Punkte</label></td>
			</>
		},
		{ td:
			<>
				<td><label>Chance</label></td>
				<td><label>alle Augen<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td>gesamt<br/>unterer Teil</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg>
				</td>
			</>
		},
		{ td:
			<>
				<td>gesamt<br/>oberer Teil</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg>
				</td>
			</>
		},
		{ td:
			<>
				<td>Endsumme</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg>
				</td>
			</>
		}
	]





	useEffect(() => {if(tableRef.current) {setTableWidth(tableRef.current.offsetWidth)}}, [tableRef])

	const PlayerTable = () => {

		const g = JSON.parse(sessionStorage.getItem(sessionStorage_gnadenwurf)) 
		gnadenwurf = g ? g : session.List_Players?.map(() => false)

		return (
			<table id={id_playerTable} className='table playerTable' style={{ width: tableWidth, maxWidth: tableWidth }}>
				<tbody>
					<tr>
						<td>Spieler</td>
						{session.List_Players?.map((p, i) => (
							<td key={i}>{p.Name}</td>
						))}
					</tr>
					<tr>
						<td>Spieler gesamt</td>
						{session.List_Players?.map((p, i) => (
							<td key={i}><label>0</label></td>
						))}
					</tr>
					<tr>
						<td>Gnadenwurf</td>
						{session.List_Players?.map((p, i) => (
							<td key={i} ><input className='checkbox' type='checkbox' defaultChecked={gnadenwurf[i]} onChange={(e) => handleGnadenwurfChange(i, e.target.checked)} /></td>
						))}
					</tr>
				</tbody>
			</table>
		)

	}

	const Table = (rows, tableID) => {

		const columns = Array.from({ length: session.Attributes?.Columns }, (_, index) => index)
		if(columnsSum.length === 0 && tableID === id_upperTable) for(let i = 0; session.List_Players?.length * session.Attributes?.Columns > i; i++) {columnsSum.push({Upper: 0, Bottom: 0, All: 0})}

		return (
			<table id={tableID} className='table' ref={tableRef}>
				<tbody>
					{rows.map((r, currentRowIndex) => {
						return (
							<tr key={currentRowIndex} className='row'>
								{r.td}
								{session.List_Players?.map((player, currentPlayerIndex) => {
									return (
										columns.map((currentColumnIndex) => {

											const css = {
												className: 'kniffelInput',
												inputMode: 'numeric',
												tableid: tableID,
												column: currentColumnIndex + (currentPlayerIndex * session.Attributes.Columns),
												row: currentRowIndex,
												onBlur: onblurEvent,
												onInput: inputEvent,
												defaultValue: sessionStorage.getItem((tableID === id_upperTable ? sessionStorage_upperTable_substring : sessionStorage_bottomTable_substring) + currentRowIndex + '.' + (currentColumnIndex  + (currentPlayerIndex * session.Attributes.Columns))),
												style: { backgroundColor: player.Color }
											}

											let e
											if(currentRowIndex < rows.length - 3) {
												e = <input {...css}/>
											} else {
												e = <label {...css}/>
											}

											return (
												<td key={`${currentPlayerIndex}.${currentRowIndex}.${currentColumnIndex}`} style={{ backgroundColor: player.Color }}>
													{e}
												</td>
											)
										})
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
		)

	} 




	useEffect(() => {
		
		async function connect() {
			await axiosPrivate.get('/game',
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			).catch(() => {
				navigate('/login', { replace: true })
			})
		}

		connect()

		const elements = document.getElementsByClassName('kniffelInput')
		if(!session) return navigate('/creategame', { replace: true })
		resizeEvent()

		for(let i = 0; session.List_Players.length * session.Attributes.Columns > i; i++) {
			calculateUpperColumn(i)
			calculateBottomColumn(i)
		}

		if (elements) {
			for(const e of elements) {
				e.addEventListener('focus', focusEvent)
				e.addEventListener('blur', removeFocusEvent)
			}
		}

		return () => {
			for(const e of elements) {
				e.removeEventListener('focus', focusEvent)
				e.removeEventListener('blur', removeFocusEvent)
			}
		}

	}, [])

	const focusEvent = (element) => {

		const h = 'highlighted'
	
		const r = element.target.closest('tr')
		if(!r.classList.contains(h)) {
			r.classList.add(h)
		}
	
		removeFocusEvent(r)

	}
	
	const removeFocusEvent = (r) => {
	
		const h = 'highlighted'
	
		const u = document.getElementById(id_upperTable).rows
		for(const e of u) {
			if(e !== r) {e.classList.remove(h)}
		}
	
		const b = document.getElementById(id_bottomTable).rows
		for(const e of b) {
			if(e !== r) {e.classList.remove(h)}
		}
	
	}

	const onblurEvent = (element) => {
		const e = element.target
		if(e) {
			const id = e.getAttribute('tableid')
			const column = Number(e.getAttribute('column'))
	
			saveElement(
				id, 
				e.value, 
				column, 
				Number(e.getAttribute('row')))
		
			if(id === id_upperTable) {
				calculateUpperColumn(column)
			} else {
				calculateBottomColumn(column)
			}
		}
	}

	const inputEvent = (element) => {

		const e = element.target
		if (isNaN(parseFloat(e.value)) || !isFinite(e.value) || e.value.length > 2) {
			e.value = e.value.slice(0, -1)
		}
	
	}





	//__________________________________________________Calculating and endgame__________________________________________________
	
	const calculateUpperColumn = (columnIndex) => {
	
		const column = document.getElementById(id_upperTable).querySelectorAll(`[column='${columnIndex}']`)
	
		let columnCompleted = true
		let sum = 0
	
		for(let i = 0; 6 > i; i++) {
	
			const n = column[i].value
			if(n === '') {
				columnCompleted = false
			} else {
				sum += Number(n)
			}
	
		}
	
		const bottomLabels = document.getElementById(id_bottomTable).querySelectorAll(`label[column='${columnIndex}']`)
		column[6].textContent = sum
		if(Boolean(columnCompleted)) {
	
			sum = sum >= 63 ? sum + 35 : sum
			column[7].textContent = sum >= 63 ? 35 : '-'
			column[8].textContent = sum
			
			bottomLabels[1].textContent = sum
			
		} else {
	
			column[7].textContent = ''
			column[8].textContent = ''
			bottomLabels[1].textContent = ''
	
		}
	
		calculateBottomLabels(columnIndex, bottomLabels)
		columnsSum[columnIndex].Upper = sum
		calculateScores()
	
	}
	
	const calculateBottomColumn = (columnIndex) => {
	
		const column = document.getElementById(id_bottomTable).querySelectorAll(`[column='${columnIndex}']`)
	
		let columnCompleted = true
		let sum = 0
	
		for(let i = 0; 7 > i; i++) {
	
			const n = column[i].value
			if(n === '') {
				columnCompleted = false
			} else {
				sum += Number(n)
			}
	
		}
	
		if(Boolean(columnCompleted)) {
	
			column[7].textContent = sum
			
		} else {
	
			column[7].textContent = ''
			column[9].textContent = ''
	
		}
	
		calculateBottomLabels(columnIndex, document.getElementById(id_bottomTable).querySelectorAll(`label[column='${columnIndex}']`))
		columnsSum[columnIndex].Bottom = sum
		calculateScores()
	
	}
	
	const calculateBottomLabels = (columnIndex, bottomLabels) => {
	
		const up = Number(bottomLabels[0].textContent)
		const bottom = Number(bottomLabels[1].textContent)
		const sum = up + bottom
	
		bottomLabels[2].textContent = up !== 0 && bottom !== 0 ? sum : ''
		columnsSum[columnIndex].All = Number(bottomLabels[2].textContent)
	
	}
	
	const calculateScores = () => {
	
		const playerTableLabels = document.getElementById(id_playerTable).querySelectorAll('label')
		
		for(let i = 0; session.List_Players.length > i; i++) {
	
			let sum = 0
			for(let c = 0; session.Attributes.Columns > c; c++) {
	
				const column = columnsSum[c + i * session.Attributes.Columns]
				if(column.All !== 0) {
					sum += column.All
				} else {
					sum += column.Upper + column.Bottom
				}
	
			}
			playerTableLabels[i].textContent = sum
	
		}
	
	}





	//__________________________________________________SessionStorage__________________________________________________
	
	const saveElement = (tableID, value, column, row) => {
	
		const tmp = (tableID === id_upperTable ? sessionStorage_upperTable_substring : sessionStorage_bottomTable_substring) + row + '.' + column
		if(value === '') {sessionStorage.removeItem(tmp)
		} else {sessionStorage.setItem(tmp, value)}
	
	}





	//____________________SaveResults____________________
	
	const saveResults = async () => {
	
		for(const element of columnsSum) {
			if(element.All === 0) {
				window.alert('Bitte alle Werte eingeben!')
				return
			}
		}
		
		if(session.List_Players.length < 2) navigate('/creategame', { replace: true })


		//____________________Players____________________
		const tmp_playerScores = document.getElementById(id_playerTable).querySelectorAll('label')
		const playerScores = []
		for(let i = 0; tmp_playerScores.length > i; i++) {playerScores.push(tmp_playerScores[i].textContent)}
	
		let winnerIndex = [0] //It's possible that multiple players have the same score, therefore an array
	
		for(let i = 1; session.List_Players.length > i; i++) {
			if(playerScores[i] != null) {
				if(playerScores[i] > playerScores[winnerIndex[0]]) {
					winnerIndex.length = 0
					winnerIndex.push(i)
				} else if (playerScores[i] === playerScores[winnerIndex[0]]) {
					winnerIndex.push(i)
				}
			}
		}
	
		for(const i of winnerIndex) {session.List_Players[i].Wins++}
	
	
		//____________________Attributes____________________
		session.Attributes.LastPlayed = new Date()
	
	
		//____________________FinalScore____________________
		const finalScores = createFinalScoreElement(session.List_Players, playerScores, session.Attributes)
	
		const json = JSON.stringify({ 
			id: session.id,
			Attributes: JSON.stringify(session.Attributes),
			List_Players: JSON.stringify(session.List_Players),
			FinalScores: finalScores
		})

		await axiosPrivate.post('/game',
			json,
			{
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		)
	
	
		sessionStorage.setItem(sessionStorage_winner, JSON.stringify(winnerIndex))
		sessionStorage.setItem(sessionStorage_players, JSON.stringify(session.List_Players))
		sessionStorage.removeItem(sessionStorage_session)
		
		clearSessionStorageTables()
		navigate('/endscreen', { replace: true })
	
	}


	


	const newGame = () => {
	
		clearSessionStorage()
		navigate('/creategame', { replace: true })
	
	}





	return (
		<>
			{PlayerTable()}
			{Table(upperTable_rows, id_upperTable)}
			{Table(bottomTable_rows, id_bottomTable)}

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<button 
					onClick={newGame} 
					className='button'
					style={{
						width: '40%',
						// margin: '5px',
						textWrap: 'nowrap',
						background: 'none',
						border: 'none',
						boxShadow: 'none',
						height: '40px',
						fontSize: '17px',
					}}
				>Neues Spiel</button>
				<button 
					onClick={saveResults} 
					className='button'
					style={{
						width: '60%',
						padding: '10px',
						marginRight: '5px',
					}}
				>Spiel beenden</button>
			</div>
		</>
	)
}

export default Games
