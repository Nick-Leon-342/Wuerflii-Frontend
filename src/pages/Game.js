

import '../App.css'
import './css/Game.css'

import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { substring_sessionStorage, createFinalScoreElement, sessionStorage_inputType, sessionStorage_lastPlayer, sessionStorage_winner, sessionStorage_gnadenwurf, sessionStorage_session, id_playerTable, id_bottomTable, id_upperTable, clearSessionStorage, sessionStorage_players } from './utils'
import { possibleEntries_upperTable, possibleEntries_bottomTable} from './PossibleEntries'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'





function Games() {

	const navigate = useNavigate()
	const tableRef = useRef(null)
	const axiosPrivate = useAxiosPrivate()

	const [ columnsSum ] = useState([])
	const [ tableColumns ] = useState([])
	const [ tableWidth, setTableWidth ] = useState(0)
	const [ lastPlayerIndex, setLastPlayer ] = useState(-1)

	const session = JSON.parse(sessionStorage.getItem(sessionStorage_session))

	



	useEffect(() => {if(tableRef.current) {setTableWidth(tableRef.current.offsetWidth)}}, [tableRef])

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
		if(!session || !session.Attributes || !session.List_Players ) return navigate('/creategame', { replace: true })

		for(const p of session?.List_Players) {
			for(let i = 0; session?.Attributes.Columns > i; i++) {
				calculateUpperColumn(p.Alias, i)
				calculateBottomColumn(p.Alias, i)
			}
		}
		
		const lastPlayer = sessionStorage.getItem(sessionStorage_lastPlayer)
		if(lastPlayer) setLastPlayer(Number(lastPlayer))

		const elements = document.getElementsByClassName('kniffelInput')
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

	const newGame = () => {
	
		clearSessionStorage()
		navigate('/creategame', { replace: true })
	
	}

	const isIOS = () => {

		let userAgent = navigator.userAgent || window.opera
		if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {return true}
		return false
	
	}


	// __________________________________________________Gnadenwurf__________________________________________________
	// Gnadenwurf is an extra try

	const [gnadenwurf, setGnadenwurf] = useState(() => {
			const g = JSON.parse(sessionStorage.getItem(sessionStorage_gnadenwurf))
			if(g) return g
			const tmp = {}
			session?.List_Players?.map((p) => (
				tmp[p.Alias] = false
			))
			return tmp
		})
  
	const handleGnadenwurfChange = (alias, checked) => {

		const g = {...gnadenwurf}
		g[alias] = checked
		setGnadenwurf(g)
		sessionStorage.setItem(sessionStorage_gnadenwurf, JSON.stringify(g))

	}

	



	// __________________________________________________InputType__________________________________________________

	const [ inputType, setInputType ] = useState(Number(sessionStorage.getItem(sessionStorage_inputType)) || session?.Attributes?.InputType)

	const handleInputTypeChange = (e) => {

		const v = Number(e.target.value)
		sessionStorage.setItem(sessionStorage_inputType, v)
		setInputType(v)

	}





	// __________________________________________________TableGeneration__________________________________________________

	const thickBorder = '2px solid var(--text-color)'

	const upperTable_rows = [
		{ td:
			<>
				<td style={{ borderLeft: thickBorder, borderTop: thickBorder }}>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/></svg>
				</td>
				<td style={{ borderTop: thickBorder }}><label>Nur Einser<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder }}>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				</td>
				<td><label>Nur Zweier<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder }}>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				</td>
				<td><label>Nur Dreier<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder }}>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				</td>
				<td><label>Nur Vierer<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder }}>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='555' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				</td>
				<td><label>Nur Fünfer<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder, borderBottom: thickBorder }}>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='860' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='860' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
					<svg className='kniffelImage' viewBox='-0.5 -0.5 1110 1110'><rect x='30' y='30' width='1050' height='1050' rx='157.5' ry='157.5' fill='none' strokeWidth='60' pointerEvents='all'/><ellipse cx='860' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='555' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='844.5' rx='100' ry='100' pointerEvents='all'/><ellipse cx='250' cy='270' rx='100' ry='100' pointerEvents='all'/><ellipse cx='860' cy='270' rx='100' ry='100' pointerEvents='all'/></svg>
				</td>
				<td style={{ borderBottom: thickBorder }}><label>Nur Sechser<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder }}>gesamt</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg>
				</td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder }}>Bonus bei 63<br/>oder mehr</td>
				<td>plus 35</td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder, borderBottom: thickBorder }}>gesamt<br/>oberer Teil</td>
				<td style={{ borderBottom: thickBorder }}>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg>
				</td>
			</>
		}
	]

	const bottomTable_rows = [
		{ td:
			<>
				<td style={{ borderLeft: thickBorder, borderTop: thickBorder }}><label>Dreiferpasch</label></td>
				<td style={{ borderTop: thickBorder }}><label>alle Augen<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder }}><label>Viererpasch</label></td>
				<td><label>alle Augen<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder }}><label>Full-House</label></td>
				<td><label>25<br/>Punkte</label></td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder }}><label>Kleine Straße</label></td>
				<td><label>30<br/>Punkte</label></td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder }}><label>Große Straße</label></td>
				<td><label>40<br/>Punkte</label></td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder }}><label>Kniffel</label></td>
				<td><label>50<br/>Punkte</label></td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder, borderBottom: thickBorder }}><label>Chance</label></td>
				<td style={{ borderBottom: thickBorder }}><label>alle Augen<br/>zählen</label></td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder }}>gesamt<br/>unterer Teil</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg>
				</td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder }}>gesamt<br/>oberer Teil</td>
				<td>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg>
				</td>
			</>
		},
		{ td:
			<>
				<td style={{ borderLeft: thickBorder, borderBottom: thickBorder }}>Endsumme</td>
				<td style={{ borderBottom: thickBorder }}>
					<svg height='13px' viewBox='-0.5 -0.5 700 300'><path d='M 0.5 197 L 0.5 101 L 483.49 101 L 483.49 0.5 L 699.5 149 L 483.49 297.5 L 483.49 197 Z' strokeMiterlimit='10' pointerEvents='all'/></svg>
				</td>
			</>
		}
	]

	const PlayerTable = () => {

		return (
			<table id={id_playerTable} className='table playerTable' style={{ width: tableWidth, maxWidth: tableWidth }}>
				<tbody>
					<tr>
						<td style={{ borderLeft: thickBorder, borderRight: thickBorder, borderTop: thickBorder }}>
							<span>Spieler </span>
							<svg onClick={() => document.getElementById('modal-nextPlayer').showModal()} height='18' viewBox='0 -960 960 960'><path d='M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'/></svg>
						</td>
						{session?.List_Players?.map((p, i) => (
							<td key={i} style={{ borderTop: thickBorder, borderRight: thickBorder }}>
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
						<td style={{ borderLeft: thickBorder, borderRight: thickBorder }}>Spieler gesamt</td>
						{session?.List_Players?.map((p, i) => (
							<td key={i} alias={p.Alias} style={{ borderRight: thickBorder }}></td>
						))}
					</tr>
					<tr>
						<td style={{ borderLeft: thickBorder, borderRight: thickBorder, borderBottom: thickBorder }}>Gnadenwurf</td>
						{session?.List_Players?.map((p, i) => (
							<td key={i} style={{ borderBottom: thickBorder, borderRight: thickBorder }}><input className='checkbox' type='checkbox' checked={gnadenwurf[p.Alias]} onChange={(e) => handleGnadenwurfChange(p.Alias, e.target.checked)} /></td>
						))}
					</tr>
				</tbody>
			</table>
		)

	}

	const Table = (rows, tableID) => {

		if(!session || !session.List_Players) return
		if(columnsSum.length === 0 && tableID === id_upperTable) {
			for(const p of session.List_Players) {
				for(let c = 0; session?.Attributes?.Columns > c; c++) {
					columnsSum.push({Alias: p.Alias, Column: c, Upper: 0, Bottom: 0, All: 0})
				}
			}
		}

		if(tableColumns.length !== ( session?.List_Players?.length * session?.Attributes?.Columns * 2 ))
		for(const p of session?.List_Players) {
			for(let c = 0; session?.Attributes?.Columns > c; c++) {

				let tmp = JSON.parse(sessionStorage.getItem(substring_sessionStorage + p.Alias + '_' + tableID + '_' + c))
				if(!tmp || !tmp.Alias) {
					tmp = {
						Alias: p.Alias,
						Column: c,
						TableID: tableID,
					}

					for(let r = 0; rows.length - 3 > r; r++) {
						tmp[r] = null
					}
				}

				tableColumns.push(tmp)

			}
		}

		const columns = Array.from({ length: session?.Attributes?.Columns }, (_, index) => index)

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
												column: currentColumnIndex,
												row: currentRowIndex,
												playerindex: currentPlayerIndex,
												alias: player.Alias,
												onInput: inputEvent,
												defaultValue: getDefaultValue( tableID, player.Alias, currentColumnIndex, currentRowIndex ),
												style: { backgroundColor: player.Color },
											}

											const id = `${tableID}_${currentRowIndex}`
											const possibleEntries = (tableID === id_upperTable ? possibleEntries_upperTable : possibleEntries_bottomTable)[currentRowIndex]

											let e
											if(currentRowIndex < rows.length - 3) {

												if(inputType === 1) {

													e = <select {...css} style={{ backgroundColor: player.Color, paddingLeft: isMobile && isIOS() ? '20px' : '' }} onChange={(e) => {onblurEvent(e); removeFocusEvent(e)}}>
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

												return (
													<td 
														key={`${currentPlayerIndex}.${currentRowIndex}.${currentColumnIndex}`} 
														style={{ 
															backgroundColor: player.Color, 
															borderLeft: currentColumnIndex === 0 ? thickBorder : '1px solid var(--text-color-light)', 
															borderRight: currentColumnIndex === session?.Attributes?.Columns -1 ? thickBorder : '1px solid var(--text-color-light)',
															borderBottom: currentRowIndex === rows.length - 1 ? thickBorder : '1px solid var(--text-color-light)',
														}}>
														{e}
													</td>
												)

											}

											return (
												<td 
													key={`${currentPlayerIndex}.${currentRowIndex}.${currentColumnIndex}`} 
													style={{ 
														backgroundColor: player.Color, 
														borderTop: currentRowIndex === 0 ? thickBorder : '1px solid var(--text-color-light)', 
														borderLeft: currentColumnIndex === 0 ? thickBorder : '1px solid var(--text-color-light)', 
														borderRight: currentColumnIndex === session?.Attributes?.Columns -1 ? thickBorder : '1px solid var(--text-color-light)',
														borderBottom: currentRowIndex === rows.length - 4 ? thickBorder : '1px solid var(--text-color-light)', 
													}}>
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

	const getDefaultValue = (tableID, alias, column, row) => {
		for(const c of tableColumns) {
			if(c.TableID === tableID && c.Alias === alias && c.Column === column) {
				return c[row]
			}
		}
	}





	// __________________________________________________Events__________________________________________________

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
			const tableID = e.getAttribute('tableid')
			const row = Number(e.getAttribute('row'))
			const column = Number(e.getAttribute('column'))
			const alias = e.getAttribute('alias')
			const playerindex = Number(e.getAttribute('playerindex'))

			let value = e.value
			const r = (tableID === id_upperTable ? possibleEntries_upperTable : possibleEntries_bottomTable)[row]

			if(r.includes(Number(value)) || value === '') {
				
				if(value) {
					setLastPlayer(playerindex)
					sessionStorage.setItem(sessionStorage_lastPlayer, Number(e.getAttribute('playerIndex')))
				}

			} else {
				
				document.getElementById('modal-invalidnumber').showModal()
				document.getElementById('message-invalidnumber').innerText = `${value} ist nicht zulässig!\nZulässig sind: ${r}`

				e.value = ''
				value = ''

			}

			let array
			for(const c of tableColumns) {
				if(c.TableID === tableID && c.Alias === alias && c.Column === column) {
					c[row] = value
					array = c
					break
				}
			}
			sessionStorage.setItem(substring_sessionStorage + alias + '_' + tableID + '_' + column, JSON.stringify(array))

			if(tableID === id_upperTable) {
				calculateUpperColumn(alias, column)
			} else {
				calculateBottomColumn(alias, column)
			}
			
		}

	}

	const inputEvent = (element) => {

		const e = element.target
		if (isNaN(parseFloat(e.value)) || !isFinite(e.value) || e.value.length > 2) {
			e.value = e.value.slice(0, -1)
		}
	
	}





	//__________________________________________________Calculating__________________________________________________
	
	const calculateUpperColumn = (alias, columnIndex) => {
	
		const column = document.getElementById(id_upperTable).querySelectorAll(`[alias='${alias}'][column='${columnIndex}']`)
	
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
	
		const bottomLabels = document.getElementById(id_bottomTable).querySelectorAll(`label[alias='${alias}'][column='${columnIndex}']`)
		column[6].innerText = sum
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
	
		calculateBottomLabels(alias, columnIndex, bottomLabels)
		for(const c of columnsSum) {
			if(c.Alias === alias && c.Column === columnIndex) {
				c.Upper = sum
				break
			}
		}
		calculateScore(alias)
	
	}
	
	const calculateBottomColumn = (alias, columnIndex) => {
	
		const column = document.getElementById(id_bottomTable).querySelectorAll(`[alias='${alias}'][column='${columnIndex}']`)
	
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
	
		calculateBottomLabels(alias, columnIndex, document.getElementById(id_bottomTable).querySelectorAll(`label[alias='${alias}'][column='${columnIndex}']`))
		for(const c of columnsSum) {
			if(c.Alias === alias && c.Column === columnIndex) {
				c.Bottom = sum
				break
			}
		}
		calculateScore(alias)
	
	}
	
	const calculateBottomLabels = (alias, columnIndex, bottomLabels) => {
	
		const up = Number(bottomLabels[0].textContent)
		const bottom = Number(bottomLabels[1].textContent)
		const sum = up + bottom
	
		bottomLabels[2].textContent = up !== 0 && bottom !== 0 ? sum : ''
		for(const c of columnsSum) {
			if(c.Alias === alias && c.Column === columnIndex) {
				c.All = Number(bottomLabels[2].textContent)
			}
		}
	
	}
	
	const calculateScore = (alias) => {

		let sum = 0

		for(const c of columnsSum) {
			if(c.Alias === alias) {
				sum += c.All || (c.Upper + c.Bottom)
			}
		}

		document.getElementById(id_playerTable).querySelector(`[alias='${alias}']`).textContent = sum
	
	}





	//__________________________________________________FinishGame/SaveResults__________________________________________________
	
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
		const playerScores = {}	
		const list_winnerAlias = [] //It's possible that multiple players have the same score, therefore an array
		const list_winnerName = []

		let highestScore = 0
		for(const p of session?.List_Players) {

			const v = Number(document.getElementById(id_playerTable).querySelector(`[alias='${p.Alias}']`).textContent)
			playerScores[p.Alias] = v
			if(highestScore < v) {
				list_winnerAlias.length = 0
				list_winnerAlias.push(p.Alias)
				list_winnerName.length = 0
				list_winnerName.push(p.Name)
				highestScore = v
			} else if(v === highestScore) {
				list_winnerAlias.push(p.Alias)
				list_winnerName.push(p.Name)
			}

		}

		if(askIfSurrender) {
			list_winnerAlias.length = 0
			list_winnerAlias.push(askIfSurrender)
		}
	
		for(const w of list_winnerAlias) {
			for(const p of session?.List_Players) {
				if(p.Alias === w) {
					p.Wins++
					break
				}
			}
		}
	
	
		//____________________Attributes____________________
		session.Attributes.LastPlayed = new Date()
		session.Attributes.InputType = inputType
	
	
		//____________________FinalScore____________________
		const finalScores = createFinalScoreElement(session.Attributes, Boolean(askIfSurrender), list_winnerAlias, playerScores)
	
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
		).then(() => {
			sessionStorage.setItem(sessionStorage_winner, JSON.stringify(list_winnerName))
			sessionStorage.setItem(sessionStorage_session, JSON.stringify(session))
			
			navigate('/endscreen', { replace: true })
		}).catch((err) => {
			console.log(err)
		})
	
	}


	


	// __________________________________________________Modal-Surrender__________________________________________________

	const [askIfSurrender, setAskIfSurrender] = useState()	//if -1 then dont ask, else it's the index of the 'winner'

	const handleSurrender = () => {document.getElementById('modal-surrender').showModal()}

	const closeSurrender = () => {
		document.getElementById('modal-surrender').close()
		setAskIfSurrender()
	}





	// __________________________________________________Modal-Edit__________________________________________________

	const [ tmpListPlayers, setTmpListPlayers ] = useState()

	const modalEditClose = () => {
		setTmpListPlayers()
		document.getElementById('modal-edit').close()
	}

	const modalEditSave = async () => {

		session.List_Players = tmpListPlayers
		sessionStorage.setItem(sessionStorage_session, JSON.stringify(session))

		if(session.id) {

			await axiosPrivate.post('/updatelistplayers',
				{ id: session.id, List_Players: JSON.stringify(session.List_Players) },
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			).catch((err) => {
				console.log(err)
				return
			})
		}
		window.location.reload()

	}

	const modalEditShow = () => {
		setTmpListPlayers(session?.List_Players)
		document.getElementById('modal-edit').showModal()
	}

	const handleOnDragEnd = (result) => {

		if(!result.destination) return
		const tmp = [...tmpListPlayers]
		const [item] = tmp.splice(result.source.index, 1)
		tmp.splice(result.destination.index, 0, item)

		setTmpListPlayers(tmp)

	}


	



	return (
		<>

			{/* __________________________________________________Dialogs__________________________________________________ */}

			<dialog id='modal-surrender' className='modal'>
				<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<svg onClick={closeSurrender} height='24' viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
				</div>

				<h1>Gewinner auswählen</h1>
				<div style={{ display: askIfSurrender ? '' : 'none' }}>
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
							onClick={() => setAskIfSurrender(p.alias)} 
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

			<dialog id='modal-edit' className='modal'>
				<div 
					style={{
						display: 'flex',
						flexDirection: 'column',
						width: '',
					}}
				>
					<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<svg onClick={modalEditClose} height='24' viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
					</div>
					
					<h1>Bearbeiten</h1>

					{/* ______________________________ChangeNames______________________________ */}
					{/* To test the drag and drop function you have to disable/comment React.StrictMode in index.js */}

					{tmpListPlayers && <DragDropContext onDragEnd={handleOnDragEnd}>
						<Droppable droppableId='editplayers'>
							{(provided) => (
								<ul {...provided.droppableProps} ref={provided.innerRef} style={{ padding: '0' }}>
									{tmpListPlayers.map((p, index) => (
										<Draggable key={p.Alias} draggableId={p.Alias} index={index}>
											{(provided) => (
												<li
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													ref={provided.innerRef}
													className='enterNamesElement'
												>
													<svg style={{ marginLeft: '20px', marginRight: '15px' }} height="10px" viewBox="-0.5 -0.5 741 450"><g><rect x="0" y="0" width="740" height="150" rx="16.5" ry="16.5" pointerEvents="all"/><rect x="0" y="260" width="740" height="150" rx="16.5" ry="16.5" pointerEvents="all"/></g></svg>
													<input
														defaultValue={p.Name}
														onChange={(e) => p.Name = e.target.value}
														
													/>
													<input
														className={isMobile ? 'colorbox-mobile' : 'colorbox-computer'}
														type='color'
														defaultValue={p.Color}
														onChange={(e) => p.Color = e.target.value}
													/>
												</li>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</ul>
							)}
						</Droppable>
					</DragDropContext>}

					<button className='button' onClick={modalEditSave} style={{ width: '100%' }}>Speichern</button>

				</div>
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





			{/* __________________________________________________Page__________________________________________________ */}

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<select
					value={inputType}
					onChange={handleInputTypeChange}
					style={{
						borderRadius: '10px',
						height: '30px',
						padding: '5px',
						marginLeft: '5px',
						marginRight: '10px',
						border: '1px solid var(--text-color)',
						outline: 'none',
					}}
				>
					<option value={1} key='1'>Auswahl</option>
					<option value={2} key='2'>Auswahl und Eingabe</option>
					<option value={3} key='3'>Eingabe</option>
				</select>

				<svg onClick={modalEditShow} width='25' viewBox="0 -960 960 960" ><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>

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
