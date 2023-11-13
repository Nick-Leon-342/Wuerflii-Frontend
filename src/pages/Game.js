

import '../App.css'
import './css/Game.css'

import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { createFinalScoreElement, id_playerTable, id_bottomTable, id_upperTable, upperTable_rows, bottomTable_rows, thickBorder } from './utils'
import { possibleEntries_upperTable, possibleEntries_bottomTable} from './PossibleEntries'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import Loader from '../components/Loader'
import io from 'socket.io-client'
import { REACT_APP_BACKEND_URL } from '../pages/utils-env'




const substring_sessionStorage = 'kniffel_sessionStorage_'
function Games() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const location = useLocation()
	const urlParams = new URLSearchParams(location.search)
	const [ session, setSession ] = useState()
	const sessionid = urlParams.get('sessionid')
	const joincode = urlParams.get('joincode')

	const [ columnsSum ] = useState([])
	const [ tableColumns ] = useState([])
	const [ socket, setSocket ] = useState()
	const [ tableWidth, setTableWidth ] = useState(0)
	const [ lastPlayerIndex, setLastPlayerIndex ] = useState(+urlParams.get('lastplayer'))
	const [ loaderVisible, setLoaderVisible ] = useState(false)
	const [ disableFinishGame, setDisableFinishGame ] = useState(false)

	const updateURL = () => {
		const updatedURL = window.location.href.split('?')[0] + '?' + urlParams.toString()
		window.history.pushState({ path: updatedURL }, '', updatedURL)
	}

	const start = (function() {
		const storedDate = urlParams.get('start')
		if (storedDate) {
			return new Date(storedDate)
		} else {
			const currentDate = new Date()
			urlParams.set('start', currentDate)
			updateURL()
			return currentDate
		}
	})()


	


	useLayoutEffect(() => {
		
		const pt = document.getElementById(id_playerTable)
		const ut = document.getElementById(id_upperTable)

		if(!pt || !ut) return

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
			await axiosPrivate.get(`/game?sessionid=${sessionid}&joincode=${joincode}`,
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			).then((res) => {
				console.log(res?.data)
				setSession(res?.data)
			}).catch(() => {
				return navigate('/creategame', { replace: true })
			})
		}

		if(!sessionid) return navigate('/creategame', { replace: true })
		
		connect()

		const tmp_socket = io.connect(REACT_APP_BACKEND_URL, { auth: { joincode: joincode } })
		setSocket(tmp_socket)
		tmp_socket.on('chat message', (msg) => {
			console.log('Nachricht empfangen:', msg)
		})

		return () => {
			tmp_socket.disconnect()
		}

	}, [])

	const newGame = () => {
	
		navigate('/creategame', { replace: true })
	
	}

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
		socket.emit('UpdateGnadenwurf', g)

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

		if(tableColumns.length !== ( session?.List_Players?.length * session?.Columns * 2 ))
		for(const p of session?.List_Players) {
			for(let c = 0; session?.Columns > c; c++) {

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

		for(const p of session?.List_Players) {
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
			const row = Number(e.getAttribute('row'))
			const column = Number(e.getAttribute('column'))
			const alias = e.getAttribute('alias')
			const playerindex = Number(e.getAttribute('playerindex'))

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





	//__________________________________________________FinishGame/SaveResults__________________________________________________

	const finishGame = () => {

		socket.emit('Finish', 'FINISH')
	
		if(!askIfSurrender) {
			for(const element of columnsSum) {
				if(element.All === '0' || element.All === 0) {
					document.getElementById('modal-error-finishgame').showModal()
					return
				}
			}
		}

		document.getElementById('modal-finishgame').showModal()

	}
	
	const saveResults = async () => {
		
		setDisableFinishGame(true)
		setLoaderVisible(true)
		if(session.List_Players.length < 2) return navigate('/creategame', { replace: true })

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
		session.LastPlayed = new Date()
		session.InputType = inputType
	
	
		//____________________FinalScore____________________
		const finalScores = { 
			PlayerScores: playerScores, 
			...createFinalScoreElement(start, session.Columns, Boolean(askIfSurrender), list_winnerAlias, playerScores) 
		}

		await axiosPrivate.post('/game',
			JSON.stringify({ 
				...session,
				FinalScores: finalScores
			}),
			{
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		).then(() => {
	
			navigate(`/endscreen?sessionid=${session.id}&winner=${JSON.stringify(list_winnerName)}`, { replace: true })
			setLoaderVisible(false)

		}).catch((err) => {
			console.log(err)
		})
		setDisableFinishGame(false)
	
	}


	


	// __________________________________________________Modal-Surrender__________________________________________________

	const [askIfSurrender, setAskIfSurrender] = useState()	//if null then dont ask, else it's the index of the 'winner'

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

		session.List_PlayerOrder = tmpListPlayers.map((p) => p.Alias)
		session.List_Players = tmpListPlayers

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

		setTmpListPlayers(session?.List_PlayerOrder.map((alias) => getPlayer(alias)))
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

			<dialog id='modal-error-finishgame' className='modal'>
				<p id='message-finishgame' style={{ fontSize: '22px', marginTop: '20px' }}>
					Bitte alle Werte eingeben!
				</p>
				<button className='button' style={{ width: '100%' }} onClick={() => document.getElementById('modal-error-finishgame').close()}>Verstanden</button>
			</dialog>

			<dialog id='modal-newgame' className='modal'>
				<p style={{ fontSize: '22px', marginTop: '20px' }}>
					Dieses Spiel löschen<br/>und ein neues Spiel anfangen?
				</p>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<button 
						className='button' 
						onClick={newGame}
						style={{
							width: '55%',
						}}
					>Ja</button>
					<button 
						className='button' 
						onClick={() => document.getElementById('modal-newgame').close()}
						style={{
							backgroundColor: 'rgb(255, 0, 0)',
							color: 'white',
						}}
					>Abbrechen</button>
				</div>
			</dialog>

			<dialog id='modal-finishgame' className='modal'>
				<p style={{ fontSize: '22px', marginTop: '20px' }}>
					Spiel beenden?
				</p>
				<Loader loaderVisible={loaderVisible}/>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<button 
						className='button' 
						onClick={saveResults}
						disabled={disableFinishGame}
						style={{
							width: '100px',
							marginRight: '5px',
						}}
					>Ja</button>
					<button 
						className='button' 
						onClick={() => document.getElementById('modal-finishgame').close()}
						style={{
							backgroundColor: 'rgb(255, 0, 0)',
							color: 'white',
						}}
					>Abbrechen</button>
				</div>
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
						color: 'var(--text-color)',
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
					onClick={() => document.getElementById('modal-newgame').showModal()} 
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
					onClick={finishGame}
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
