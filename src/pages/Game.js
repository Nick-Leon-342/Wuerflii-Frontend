

import '../App.css'
import './css/Game.css'

import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { createFinalScoreElement, sessionStorage_inputType, sessionStorage_lastPlayer, sessionStorage_winner, clearSessionStorageTables, sessionStorage_gnadenwurf, sessionStorage_upperTable_substring, sessionStorage_bottomTable_substring, sessionStorage_session, id_playerTable, id_bottomTable, id_upperTable, clearSessionStorage, sessionStorage_players } from './utils'
import { possibleEntries_upperTable, possibleEntries_bottomTable} from './PossibleEntries'




function Games() {

	const navigate = useNavigate()
	const [columnsSum] = useState([])
	const axiosPrivate = useAxiosPrivate()
	const tableRef = useRef(null)
	const [tableWidth, setTableWidth] = useState(0)

	const [lastPlayerIndex, setLastPlayer] = useState(-1)

	const session = JSON.parse(sessionStorage.getItem(sessionStorage_session))
	const [inputType, setInputType] = useState(Number(sessionStorage.getItem(sessionStorage_inputType)) || session?.Attributes?.InputType)

	let gnadenwurf = session?.List_Players?.map(() => false)
  
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
		gnadenwurf = g ? g : session?.List_Players?.map(() => false)

		return (
			<table id={id_playerTable} className='table playerTable' style={{ width: tableWidth, maxWidth: tableWidth }}>
				<tbody>
					<tr>
						<td>
							<span>Spieler </span>
							<svg onClick={() => document.getElementById('modal-nextPlayer').showModal()} height='18' viewBox='0 -960 960 960'><path d='M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'/></svg>
						</td>
						{session?.List_Players?.map((p, i) => (
							<td key={i}>
								<span style={{ 
									fontWeight: (( lastPlayerIndex + 1 ) % session?.List_Players?.length) === i ? 'bold' : '',
									color: (( lastPlayerIndex + 1 ) % session?.List_Players?.length) === i ? 'rgb(0, 255, 0)' : '',
								}}>
									{p.Name}
								</span>
							</td>
						))}
					</tr>
					<tr>
						<td>Spieler gesamt</td>
						{session?.List_Players?.map((p, i) => (
							<td key={i}><label>0</label></td>
						))}
					</tr>
					<tr>
						<td>Gnadenwurf</td>
						{session?.List_Players?.map((p, i) => (
							<td key={i} ><input className='checkbox' type='checkbox' defaultChecked={gnadenwurf[i]} onChange={(e) => handleGnadenwurfChange(i, e.target.checked)} /></td>
						))}
					</tr>
				</tbody>
			</table>
		)

	}

	const Table = (rows, tableID) => {

		const columns = Array.from({ length: session?.Attributes?.Columns }, (_, index) => index)
		if(columnsSum.length === 0 && tableID === id_upperTable) for(let i = 0; session?.List_Players?.length * session?.Attributes?.Columns > i; i++) {columnsSum.push({Upper: 0, Bottom: 0, All: 0})}

		return (
			<table id={tableID} className='table' ref={tableRef}>
				<tbody>
					{rows.map((r, currentRowIndex) => {
						return (
							<tr key={currentRowIndex} className='row'>
								{r.td}
								{session?.List_Players?.map((player, currentPlayerIndex) => {
									return (
										columns.map((currentColumnIndex) => {

											const css = {
												className: `kniffelInput ${inputType === 1 ? 'select' : ''}`,
												inputMode: 'numeric',
												tableid: tableID,
												appearance: 'none',
												column: currentColumnIndex + (currentPlayerIndex * session.Attributes.Columns),
												playerindex: currentPlayerIndex,
												row: currentRowIndex,
												onInput: inputEvent,
												defaultValue: sessionStorage.getItem((tableID === id_upperTable ? sessionStorage_upperTable_substring : sessionStorage_bottomTable_substring) + currentRowIndex + '.' + (currentColumnIndex  + (currentPlayerIndex * session.Attributes.Columns))),
												style: { backgroundColor: player.Color },
											}

											const id = `${tableID}_${currentRowIndex}`
											const possibleEntries = (tableID === id_upperTable ? possibleEntries_upperTable : possibleEntries_bottomTable)[currentRowIndex]

											let e
											if(currentRowIndex < rows.length - 3) {

												if(inputType === 1) {

													e = <select {...css} style={{ backgroundColor: player.Color, paddingLeft: isMobile ? '20px' : '' }} onChange={(e) => {onblurEvent(e); removeFocusEvent(e)}}>
														<option></option>
														{possibleEntries.map((v) => (
															<option key={v} value={v}>{v}</option>
													))}
													</select>

												} else if(inputType === 2) {

													e = <>
														<input list={id} {...css} onBlur={onblurEvent}/>
														<datalist id={id}>
															{possibleEntries.map((v) => {
																return <option key={v} value={v}/>
															})}
														</datalist>
													</>
												} else if(inputType === 3) {
													
													e = <input {...css} onBlur={onblurEvent}/>

												}

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
		if(!session || !session.Attributes || !session.List_Players ) return navigate('/creategame', { replace: true })

		for(let i = 0; session.List_Players.length * session.Attributes.Columns > i; i++) {
			calculateUpperColumn(i)
			calculateBottomColumn(i)
		}
		
		const lastPlayer = sessionStorage.getItem(sessionStorage_lastPlayer)
		if(lastPlayer) setLastPlayer(Number(lastPlayer))

		if (elements) {
			for(const e of elements) {
				e.addEventListener('focus', focusEvent)
				if(inputType === 0) {
					e.addEventListener('blur', (removeFocusEvent(e?.target?.closest('tr')), onblurEvent))
				} else {
					e.addEventListener('blur', removeFocusEvent)
				}
			}
		}

		return () => {
			for(const e of elements) {
				e.removeEventListener('focus', focusEvent)
				e.removeEventListener('blur', (removeFocusEvent(e?.target?.closest('tr')), onblurEvent))
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
			const row = Number(e.getAttribute('row'))
			const column = Number(e.getAttribute('column'))
			const playerIndex = Number(e.getAttribute('playerindex'))

			let value = e.value
			const r = (id === id_upperTable ? possibleEntries_upperTable : possibleEntries_bottomTable)[row]

			if(r.includes(Number(value)) || value === '') {
				
				if(value) {
					setLastPlayer(playerIndex)
					sessionStorage.setItem(sessionStorage_lastPlayer, Number(e.getAttribute('playerIndex')))
				}

			} else {
				
				document.getElementById('modal-invalidnumber').showModal()
				document.getElementById('message-invalidnumber').innerText = `${value} ist nicht zulässig!\nZulässig sind: ${r}`

				e.value = ''
				value = ''

			}

			saveElement(
				id, 
				value, 
				column, 
				row)

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
	
		if(askIfSurrender === -1) {
			for(const element of columnsSum) {
				if(element.All === 0) {
					window.alert('Bitte alle Werte eingeben!')
					return
				}
			}
		}
		
		if(session.List_Players.length < 2) navigate('/creategame', { replace: true })


		//____________________Players____________________
		const tmp_playerScores = document.getElementById(id_playerTable).querySelectorAll('label')
		const playerScores = []
		for(let i = 0; tmp_playerScores.length > i; i++) {playerScores.push(tmp_playerScores[i].textContent)}
	
		let winnerIndex = [0] //It's possible that multiple players have the same score, therefore an array
	
		if(askIfSurrender !== -1) {

			winnerIndex.length = 0
			winnerIndex.push(askIfSurrender)

		} else {

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

		}
	
		for(const i of winnerIndex) {session.List_Players[i].Wins++}
	
	
		//____________________Attributes____________________
		session.Attributes.LastPlayed = new Date()
		session.Attributes.InputType = inputType
	
	
		//____________________FinalScore____________________
		const finalScores = createFinalScoreElement(session.List_Players, playerScores, session.Attributes, askIfSurrender !== -1)
	
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




	const handleInputTypeChange = (e) => {

		const v = Number(e.target.value)
		sessionStorage.setItem(sessionStorage_inputType, v)
		setInputType(v)

	}



	const [askIfSurrender, setAskIfSurrender] = useState(-1)	//if -1 then dont ask, else it's the index of the 'winner'

	const handleSurrender = () => {document.getElementById('modal').showModal()}
	const closeSurrender = () => {
		document.getElementById('modal').close()
		setAskIfSurrender(-1)
	}





	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div style={{ width: 'max-content' }}>
					<select
						value={inputType}
						onChange={handleInputTypeChange}
						style={{
							borderRadius: '10px',
							height: '30px',
							padding: '5px',
							marginLeft: '5px',
							border: '1px solid var(--text-color)',
							outline: 'none',
						}}
					>
						<option value={1} key='1'>Auswahl</option>
						<option value={2} key='2'>Auswahl und Eingabe</option>
						<option value={3} key='3'>Eingabe</option>
					</select>
				</div>
				<button 
					className='button'
					onClick={handleSurrender}
					style={{
						margin: '0',
						marginRight: '5px',
						background: 'none',
						boxShadow: 'none',
					}}
				>Aufgeben</button>
			</div>

			<dialog id='modal' className='modal'>
				<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<svg onClick={closeSurrender} height='24' viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
				</div>

				<h1>Gewinner auswählen</h1>
				<div style={{ display: askIfSurrender !== -1 ? '' : 'none' }}>
				<label style={{ fontSize: '22px', }}>{`Sicher, dass ${session?.List_Players[askIfSurrender]?.Name} gewinnen soll?`}</label>
					<div style={{ display: 'flex', justifyContent: 'space-around' }}>
						<button 
							className='button' 
							onClick={saveResults}
							style={{
								width: '50%',
							}}
						>Ja</button>
						<button 
							className='button' 
							onClick={closeSurrender}
							style={{
								backgroundColor: 'rgb(255, 0, 0)',
								color: 'white',
							}}
						>Abbrechen</button>
					</div>
				</div>

				<dl>
					{session?.List_Players?.map((p, i) => (
						<dt 
							className='listElement' 
							onClick={() => setAskIfSurrender(i)} 
							key={i}
							style={{
								padding: '10px',
							}}
						>
							<label
								style={{
									fontSize: '20px',
								}}
							>{p.Name}</label>
						</dt>
					))}
				</dl>
			</dialog>

			<dialog id='modal-nextPlayer' className='modal'>
				<p style={{ fontSize: '22px', marginTop: '20px' }}>
					{lastPlayerIndex === -1 
						? 'Bis jetzt war noch keiner dran!'
						: (
							<>
								{'\'' + session?.List_Players[lastPlayerIndex].Name + '\'' + ' war als letztes dran.'}<br />
								{'Nun kommt \'' + session?.List_Players[(lastPlayerIndex + 1) % session?.List_Players?.length].Name + '\''}
							</>
						)
					}
				</p>
				<button className='button' onClick={() => document.getElementById('modal-nextPlayer').close()}>Ok</button>
			</dialog>

			<dialog id='modal-invalidnumber' className='modal'>
				<p id='message-invalidnumber' style={{ fontSize: '22px', marginTop: '20px' }}></p>
				<button className='button' onClick={() => document.getElementById('modal-invalidnumber').close()}>Ok</button>
			</dialog>

			{PlayerTable()}
			{Table(upperTable_rows, id_upperTable)}
			{Table(bottomTable_rows, id_bottomTable)}

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<button 
					onClick={newGame} 
					className='button'
					style={{
						width: '40%',
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
