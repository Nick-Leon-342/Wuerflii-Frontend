

import '../App.css'
import './css/Game.css'

import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { createFinalScoreElement, id_playerTable, id_bottomTable, id_upperTable, upperTable_rows, bottomTable_rows, thickBorder } from './utils'
import { possibleEntries_upperTable, possibleEntries_bottomTable} from './PossibleEntries'
import Loader from '../components/Loader'
import io from 'socket.io-client'
import { REACT_APP_BACKEND_URL } from './utils-env'
import DragAndDropNameColorList from '../components/DragAndDropNameColorList'





function JoinGame() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const location = useLocation()
	const urlParams = new URLSearchParams(location.search)
	const [ session, setSession ] = useState()
	const joincode = +urlParams.get('joincode')

	const [ columnsSum ] = useState([])
	const [ tableColumns, setTableColumns ] = useState([])
	const [ socket, setSocket ] = useState()
	const [ tableWidth, setTableWidth ] = useState(0)
	const [ lastPlayerIndex, setLastPlayerIndex ] = useState(+urlParams.get('lastplayer'))

	const updateURL = () => {
		const updatedURL = window.location.href.split('?')[0] + '?' + urlParams.toString()
		window.history.pushState({ path: updatedURL }, '', updatedURL)
	}


	


	useLayoutEffect(() => {
		
		const ut = document.getElementById(id_upperTable)
		if(!ut) return
		setTableWidth(ut.offsetWidth)

	})

	useEffect(() => {

		if(!session) return

		for(const alias of session?.List_PlayerOrder) {
			for(let i = 0; session?.Columns > i; i++) {
				calculateUpperColumn(alias, i)
				calculateBottomColumn(alias, i)
			}
		}

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

	}, [session])

	useEffect(() => {

		async function connect() {
			await axiosPrivate.get(`/joingame?joincode=${joincode}`,
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			).then((res) => {
				console.log(res)
				setSession(res?.data?.Session)
				setTableColumns(res?.data?.TableColumns)
				setGnadenwurf(res?.data?.Gnadenwürfe)

			}).catch(() => {
				// return navigate('/creategame', { replace: true })
			})
		}
		
		connect()

		const tmp_socket = io.connect(REACT_APP_BACKEND_URL, { auth: { joincode: joincode } })
		setSocket(tmp_socket)
		tmp_socket.emit('JoinSession', '')
		tmp_socket.on('UpdateValueResponse', (res) => {
			console.log('Nachricht empfangen:', res.Response)
			const r = res.Response
			if(r.UpperTable) {
				document.getElementById(id_upperTable).querySelector(`.kniffelInput[alias='${r.Alias}'][column='${r.Column}'][row='${r.Row}']`).value = r.Value
				calculateUpperColumn(r.Alias, r.Column)
			} else {
				document.getElementById(id_bottomTable).querySelector(`.kniffelInput[alias='${r.Alias}'][column='${r.Column}'][row='${r.Row}']`).value = r.Value
				calculateBottomColumn(r.Alias, r.Column)
			}
		})
		tmp_socket.on('UpdateGnadenwurf', (res) => {
			console.log('Nachricht empfangen:', res.Response)
			setGnadenwurf(res.Response)
		})

		return () => {
			tmp_socket.disconnect()
		}

	}, [])

	const isIOS = () => {

		let userAgent = navigator.userAgent || window.opera
		if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {return true}
		return false
	
	}





	// __________________________________________________Gnadenwurf__________________________________________________
	// Gnadenwurf is an extra try

	const [gnadenwurf, setGnadenwurf] = useState({})
  
	const handleGnadenwurfChange = (alias, checked) => {

		const g = {...gnadenwurf}
		g[alias] = checked
		setGnadenwurf(g)
		socket.emit('UpdateGnadenwurf', { ...g, Valid: 'v' })

	}

	



	// __________________________________________________InputType__________________________________________________

	const [ inputType, setInputType ] = useState(+urlParams.get('inputtype') || session?.InputType)

	const handleInputTypeChange = (e) => {

		const v = Number(e.target.value)
		urlParams.set('inputtype', v)
		updateURL()
		setInputType(v)

	}





	// __________________________________________________TableGeneration__________________________________________________

	const PlayerTable = () => {

		return (
			<table id={id_playerTable} className='table playerTable' style={{ minWidth: tableWidth, width: tableWidth, maxWidth: tableWidth }}>
				<tbody>
					<tr>
						<td style={{ borderLeft: thickBorder, borderRight: thickBorder, borderTop: thickBorder }}>
							<span>Spieler </span>
							<svg onClick={() => document.getElementById('modal-nextPlayer').showModal()} height='18' viewBox='0 -960 960 960'><path d='M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'/></svg>
						</td>
						{session?.List_PlayerOrder?.map((alias, i) => {
							const player = getPlayer(alias)

							return (
								<td key={i} style={{ borderTop: thickBorder, borderRight: thickBorder }}>
									<span style={{ 
										fontWeight: (( lastPlayerIndex + 1 ) % session?.List_Players?.length) === i ? 'bold' : '',
										color: (( lastPlayerIndex + 1 ) % session?.List_Players?.length) === i ? 'rgb(0, 255, 0)' : '',
									}}>
										{player.Name}
									</span>
								</td>
							)
						})}
					</tr>
					<tr>
						<td style={{ borderLeft: thickBorder, borderRight: thickBorder }}>Spieler gesamt</td>
						{session?.List_PlayerOrder?.map((alias, i) => {
							const player = getPlayer(alias)
							return (<td key={i} alias={player.Alias} style={{ borderRight: thickBorder }} />)
						})}
					</tr>
					<tr>
						<td style={{ borderLeft: thickBorder, borderRight: thickBorder, borderBottom: thickBorder }}>Gnadenwurf</td>
						{session?.List_PlayerOrder?.map((alias, i) => {
							const player = getPlayer(alias)
							if(!gnadenwurf[alias]) gnadenwurf[alias] = false
							return (
								<td 
									key={i} 
									style={{ borderBottom: thickBorder, borderRight: thickBorder }}
								>
									<input 
										className='checkbox' 
										type='checkbox' 
										checked={gnadenwurf[alias]}
										onChange={(e) => handleGnadenwurfChange(player.Alias, e.target.checked)} 
									/>
								</td>
							)
						})}
					</tr>
				</tbody>
			</table>
		)

	}

	const Table = (rows, tableID) => {

		if(!session || !session.List_Players) return
		if(columnsSum.length === 0 && tableID === id_upperTable) {
			for(const p of session.List_Players) {
				for(let c = 0; session?.Columns > c; c++) {
					columnsSum.push({Alias: p.Alias, Column: c, Upper: 0, Bottom: 0, All: 0})
				}
			}
		}

		const columns = Array.from({ length: session?.Columns }, (_, index) => index)

		return (
			<table id={tableID} className='table'>
				<tbody>
					{rows.map((r, currentRowIndex) => {
						return (
							<tr key={currentRowIndex} className='row'>
								{r.td}
								{session?.List_PlayerOrder?.map((alias, currentPlayerIndex) => {
									const player = getPlayer(alias)

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
												} else {
													
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
															borderRight: currentColumnIndex === session?.Columns -1 ? thickBorder : '1px solid var(--text-color-light)',
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
														borderRight: currentColumnIndex === session?.Columns -1 ? thickBorder : '1px solid var(--text-color-light)',
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

	const getPlayer = (alias) => {

		for(const p of session.List_Players) {
			if(p.Alias === alias) {
				return p
			}
		}

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
			const row = +e.getAttribute('row')
			const column = +e.getAttribute('column')
			const alias = e.getAttribute('alias')
			const playerindex = +e.getAttribute('playerindex')

			let value = e.value
			const r = (tableID === id_upperTable ? possibleEntries_upperTable : possibleEntries_bottomTable)[row]

			if(r.includes(Number(value)) || value === '') {
				
				if(value) {
					setLastPlayerIndex(playerindex)
					urlParams.set('lastplayer', playerindex)
					updateURL()
				}

			} else {
				
				document.getElementById('modal-invalidnumber').showModal()
				document.getElementById('message-invalidnumber').innerText = `${value} ist nicht zulässig!\nZulässig sind: ${r}`

				e.value = ''
				value = ''

			}

			socket.emit('UpdateValue', { UpperTable: tableID === id_upperTable, Alias: alias, Row: row, Column: column, Value: value })
			
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
	
		const up = +bottomLabels[0].textContent
		const bottom = +bottomLabels[1].textContent
		const sum = up + bottom
	
		bottomLabels[2].textContent = up !== 0 && bottom !== 0 ? sum : ''
		for(const c of columnsSum) {
			if(c.Alias === alias && c.Column === columnIndex) {
				c.All = +bottomLabels[2].textContent
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


	



	return (
		<>

			{/* __________________________________________________Dialogs__________________________________________________ */}

			<dialog id='modal-nextPlayer' className='modal'>
				<p style={{ fontSize: '22px', marginTop: '20px' }}>
					{lastPlayerIndex === -1 
						? 'Bis jetzt war noch keiner dran!'
						: (
							<>
								{'\'' + session?.List_Players[lastPlayerIndex].Name + '\' war als letztes dran.'}<br />
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
						color: 'var(--text-color)',
					}}
				>
					<option value={1} key='1'>Auswahl</option>
					<option value={2} key='2'>Auswahl und Eingabe</option>
					<option value={3} key='3'>Eingabe</option>
				</select>
			</div>

			{PlayerTable()}
			{Table(upperTable_rows, id_upperTable)}
			{Table(bottomTable_rows, id_bottomTable)}

		</>
	)
}

export default JoinGame
