

import '../App.css'
import './css/Game.css'

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createFinalScoreElement, sessionStorage_winner, clearSessionStorageTables, sessionStorage_gnadenwurf, sessionStorage_upperTable_substring, sessionStorage_bottomTable_substring, sessionStorage_attributes, sessionStorage_players, id_playerTable, id_bottomTable, id_upperTable, resizeEvent, clearSessionStorage } from './utils'





function Games() {

	const navigate = useNavigate()
	let columnsSum = []

	const players = JSON.parse(sessionStorage.getItem(sessionStorage_players))
	const attributes = JSON.parse(sessionStorage.getItem(sessionStorage_attributes))
	
	let playerTable
	let upperTable
	let bottomTable





	const playerTable_rows = [
		{ td: <td>Spieler</td> },
		{ td: <td>Spieler gesamt</td>},
		{ td: <td>Gnadenwurf</td>}
	]

	const upperTable_rows = [
		{ td:
			<>
				<td>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
				</td>
				<td>Nur Einser<br/>zählen</td>
			</>
		},
		{ td:
			<>
				<td>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
				</td>
				<td>Nur Zweier<br/>zählen</td>
			</>
		},
		{ td:
			<>
				<td>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
				</td>
				<td>Nur Dreier<br/>zählen</td>
			</>
		},
		{ td:
			<>
				<td>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
				</td>
				<td>Nur Vierer<br/>zählen</td>
			</>
		},
		{ td:
			<>
				<td>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
				</td>
				<td>Nur Fünfer<br/>zählen</td>
			</>
		},
		{ td:
			<>
				<td>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='860' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='860' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' stroke='#000000' strokeWidth='60' pointerEvents='all'/><ellipse cx='860' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='555' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' fill='#000000' stroke='rgb(0, 0, 0)' pointerEvents='all'/></svg>
				</td>
				<td>Nur Sechser<br/>zählen</td>
			</>
		},
		{ td:
			<>
				<td>gesamt</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' fill='#000000' stroke='rgb(0, 0, 0)' strokeMiterlimit='10' pointerEvents='all'/></svg>
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
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' fill='#000000' stroke='rgb(0, 0, 0)' strokeMiterlimit='10' pointerEvents='all'/></svg>
				</td>
			</>
		}
	]

	const bottomTable_rows = [
		{ td:
			<>
				<td>Dreiferpasch</td>
				<td>alle Augen<br/>zählen</td>
			</>
		},
		{ td:
			<>
				<td>Viererpasch</td>
				<td>alle Augen<br/>zählen</td>
			</>
		},
		{ td:
			<>
				<td>Full-House</td>
				<td>25<br/>Punkte</td>
			</>
		},
		{ td:
			<>
				<td>Kleine Straße</td>
				<td>30<br/>Punkte</td>
			</>
		},
		{ td:
			<>
				<td>Große Straße</td>
				<td>40<br/>Punkte</td>
			</>
		},
		{ td:
			<>
				<td>Kniffel</td>
				<td>50<br/>Punkte</td>
			</>
		},
		{ td:
			<>
				<td>Chance</td>
				<td>alle Augen<br/>zählen</td>
			</>
		},
		{ td:
			<>
				<td>gesamt<br/>unterer Teil</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' fill='#000000' stroke='rgb(0, 0, 0)' strokeMiterlimit='10' pointerEvents='all'/></svg>
				</td>
			</>
		},
		{ td:
			<>
				<td>gesamt<br/>oberer Teil</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' fill='#000000' stroke='rgb(0, 0, 0)' strokeMiterlimit='10' pointerEvents='all'/></svg>
				</td>
			</>
		},
		{ td:
			<>
				<td>Endsumme</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' fill='#000000' stroke='rgb(0, 0, 0)' strokeMiterlimit='10' pointerEvents='all'/></svg>
				</td>
			</>
		}
	]





	const PlayerTable = () => {
		return (
			<table id={id_playerTable} className='table playerTable'>
				<tbody>
					<tr>
						{playerTable_rows[0].td}
						{players.map((player) => (
							<td style={{ width: `${attributes.Columns * 54}px` }}>{player.Name}</td>
						))}
					</tr>
					<tr>
						{playerTable_rows[1].td}
						{players.map(() => (
							<td><label>0</label></td>
						))}
					</tr>
					<tr>
						{playerTable_rows[2].td}
						{players.map((player) => (
							<td><input className='checkbox' type='checkbox' /></td>
						))}
					</tr>
				</tbody>
			</table>
			
		)
	}

	const Table = (rows, tableID) => {
		const columns = Array.from({ length: attributes.Columns }, (_, index) => index)

		return (
			<table id={tableID} className='table'>
				<tbody>
					{rows.map((r, currentRowIndex) => {
						return (
							<tr className='row'>
								{r.td}
								{players.map((player, currentPlayerIndex) => {
									return (
										columns.map((column) => {

											if(tableID === id_upperTable) columnsSum.push({Upper: 0, Bottom: 0, All: 0})

											const css = {
												className: 'kniffelInput',
												inputMode: 'numeric',
												tableid: tableID,
												column: column + (currentPlayerIndex * attributes.Columns),
												row: currentRowIndex,
												onBlur: onblurEvent,
												onInput: inputEvent,
												style: { backgroundColor: player.Color }
											}

											let e
											if(currentRowIndex < rows.length - 3) {
												e = <input {...css}/>
											} else {
												e = <label {...css}/>
											}

											return (
												<td style={{ backgroundColor: player.Color }}>
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

		resizeEvent()
		const elements = document.getElementsByClassName('kniffelInput')
		playerTable = document.getElementById(id_playerTable)
		upperTable = document.getElementById(id_upperTable)
		bottomTable = document.getElementById(id_bottomTable)
		loadTables()

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

	const newGame = () => {
	
		clearSessionStorage()
		navigate('/creategame', { replace: true })
	
	}

	const onblurEvent = (element) => {
		const e = element.target
		if(e) {
			// if (isNaN(parseFloat(e.value)) || !isFinite(e.value) || e.value.length > 2) {
			// 	e.value = ''
			// 	return
			// }
	
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
	
		const column = upperTable.querySelectorAll(`[column='${columnIndex}']`)
	
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
	
		const bottomLabels = bottomTable.querySelectorAll(`label[column='${columnIndex}']`)
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
	
		const column = bottomTable.querySelectorAll(`[column='${columnIndex}']`)
	
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
	
		calculateBottomLabels(columnIndex, bottomTable.querySelectorAll(`label[column='${columnIndex}']`))
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
		
		for(let i = 0; players.length > i; i++) {
	
			let sum = 0
			for(let c = 0; attributes.Columns > c; c++) {
	
				const column = columnsSum[c + i * attributes.Columns]
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
	  
	const loadTables = () => {
	
		const checks = JSON.parse(sessionStorage.getItem(sessionStorage_gnadenwurf))
		if(checks) {
			for(let i = 0; checks.length > i; i++) {
				playerTable.querySelectorAll('tr')[2].querySelectorAll('.checkbox')[i].checked = checks[i]
			}
		}
		loadTablesHelp(upperTable.querySelectorAll('input'), id_upperTable)
		loadTablesHelp(bottomTable.querySelectorAll('input'), id_bottomTable)

		for(let i = 0; attributes.Columns * players.length > i; i++) {
			calculateUpperColumn(i)
			calculateBottomColumn(i)
		}
		
	}
	
	const loadTablesHelp = (inputs, tableID) => {
	
		const placol = attributes.Columns * players.length
	
		for(let i = 0; inputs.length > i; i++) {
			inputs[i].value = sessionStorage.getItem((tableID === id_upperTable ? sessionStorage_upperTable_substring : sessionStorage_bottomTable_substring) + ~~(i/placol) + '.' + i%placol)
			// onblurEvent(inputs[i])
		}
	
	}





	//____________________SaveResults____________________
	
	const saveResults = async () => {
	
		for(const element of columnsSum) {
			if(element.All === 0) {
				window.alert('Bitte alle Werte eingeben!')
				return
			}
		}
		
		if(players.length >= 2) {
	
			if(attributes.SessionName === '') {
	
				const response = await fetch('/sessionnamerequest', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: null
				})
	
				const data = await response.json()
				attributes.SessionName = data.SessionName
	
			} 
			sendResults()
	
		} else {
			window.location.replace('/creategame')
		}
	
	}
	
	const sendResults = async () => {
	
		//____________________Players____________________
		const tmp_playerScores = document.getElementById(id_playerTable).querySelectorAll('label')
		const playerScores = []
		for(let i = 0; tmp_playerScores.length > i; i++) {playerScores.push(tmp_playerScores[i].textContent)}
	
		let winnerIndex = [0] //It's possible that multiple players have the same score, therefore an array
	
		for(let i = 1; players.length > i; i++) {
			if(playerScores[i] != null) {
				if(playerScores[i] > playerScores[winnerIndex[0]]) {
					winnerIndex.length = 0
					winnerIndex.push(i)
				} else if (playerScores[i] === playerScores[winnerIndex[0]]) {
					winnerIndex.push(i)
				}
			}
		}
	
		for(const i of winnerIndex) {players[i].Wins++}
	
		sessionStorage.setItem(sessionStorage_winner, JSON.stringify(winnerIndex))
		sessionStorage.setItem(sessionStorage_players, JSON.stringify(players))
	
	
		//____________________GameAttributes____________________
		const options = { year: 'numeric', month: 'numeric', day: 'numeric' } // 19.10.2004
		attributes.LastPlayed = new Date().toLocaleDateString('de-DE', options)
	
	
		//____________________FinalScore____________________
		const finalScores = createFinalScoreElement(playerScores)
	
		console.log(finalScores)
		const json = JSON.stringify({ Players: players, GameAttributes: attributes, FinalScores: finalScores })
		
		await fetch('/game', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: json
		})
	
		clearSessionStorageTables()
		window.location.replace('/endscreen')
	
	}






	return (
		<>
			<PlayerTable/>

			{Table(upperTable_rows, id_upperTable)}
			{Table(bottomTable_rows, id_bottomTable)}

			<button onClick={newGame} className='button'>Neues Spiel</button>
			<button onClick={saveResults} className='button'>Spiel beenden</button>
		</>
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
	
	
	
	
	
	
