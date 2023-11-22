

import '../App.css'
import './css/Game.css'

import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { createFinalScoreElement, id_playerTable, id_bottomTable, id_upperTable, thickBorder, getPlayer, updateURL, handleInputTypeChange } from '../logic/utils'
import { focusEvent, removeFocusEvent, onblurEvent } from '../logic/Events'
import Loader from '../components/Loader'
import io from 'socket.io-client'
import { REACT_APP_BACKEND_URL } from '../logic/utils-env'
import DragAndDropNameColorList from '../components/DragAndDropNameColorList'
import { calculateUpperColumn, calculateBottomColumn } from '../logic/Calculating'

import PlayerTable from '../components/PlayerTable'
import Table from '../components/Table'





function Game() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const location = useLocation()
	const urlParams = new URLSearchParams(location.search)
	const joincode = urlParams.get('joincode')
	const sessionid = urlParams.get('sessionid')
	const [ lastPlayerAlias, setLastPlayerAlias ] = useState(urlParams.get('lastplayer'))
	
	const [columnsSum] = useState([])
	
	const [ socket, setSocket ] = useState()
	const [ session, setSession ] = useState()

	const [ inputType, setInputType ] = useState()
	const [ tableWidth, setTableWidth ] = useState(0)
	const [ gnadenwurf, setGnadenwurf ] = useState({})	// Gnadenwurf is an extra try
	const [ tableColumns, setTableColumns ] = useState([])
	const [ loaderVisible, setLoaderVisible ] = useState(false)
	const [ disableFinishGame, setDisableFinishGame ] = useState(false)


	


	useLayoutEffect(() => {
		
		const ut = document.getElementById(id_upperTable)
		if(!ut) return
		setTableWidth(ut.offsetWidth)

	})

	useEffect(() => {

		if(!session) return

		for(const alias of session?.List_PlayerOrder) {
			for(let i = 0; session?.Columns > i; i++) {
				calculateUpperColumn(alias, i, columnsSum)
				calculateBottomColumn(alias, i, columnsSum)
			}
		}

		const elements = document.getElementsByClassName('kniffelInput')
		if (elements) {
			for(const e of elements) {
				e.addEventListener('focus', focusEvent)
				if(inputType === 0) {
					e.addEventListener('blur', (removeFocusEvent(e?.target?.closest('tr')), onblurEvent(e, setLastPlayerAlias, urlParams, socket, columnsSum)))
				} else {
					e.addEventListener('blur', removeFocusEvent)
				}
			}
		}

		return () => {
			for(const e of elements) {
				e.removeEventListener('focus', focusEvent)
				e.removeEventListener('blur', (removeFocusEvent(e?.target?.closest('tr')), onblurEvent(e, setLastPlayerAlias, urlParams, socket, columnsSum)))
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
				
				const tmp_session = res?.data?.Session
				columnsSum.length = 0
				for(const p of tmp_session?.List_Players) {
					for(let c = 0; tmp_session?.Columns > c; c++) {
						columnsSum.push({Alias: p.Alias, Column: c, Upper: 0, Bottom: 0, All: 0})
					}
				}
				setSession(tmp_session)
				setInputType(urlParams.get('inputtype') || tmp_session?.InputType)
				setTableColumns(res?.data?.TableColumns)
				setGnadenwurf(res?.data?.Gnadenwürfe)

			}).catch(() => {
				return navigate('/creategame', { replace: true })
			})
		}

		if(!sessionid || !joincode) return navigate('/creategame', { replace: true })
		
		connect()

		const tmp_socket = io.connect(REACT_APP_BACKEND_URL, { auth: { joincode: joincode } })
		setSocket(tmp_socket)
		tmp_socket.emit('JoinSession', '')
		tmp_socket.on('UpdateValueResponse', (msg) => {

			const m = msg.Data
			const tableID = m.UpperTable ? id_upperTable : id_bottomTable

			document.getElementById(tableID).querySelector(`.kniffelInput[alias='${m.Alias}'][column='${m.Column}'][row='${m.Row}']`).value = m.Value
			
			for(const e of tableColumns) {
				if(e.TableID === tableID && e.Alias === m.Alias && e.Column === m.Column) {
					e[m.Row] = m.Value
				}
			}

			if(m.UpperTable) {calculateUpperColumn(m.Alias, m.Column, columnsSum)
			} else {calculateBottomColumn(m.Alias, m.Column, columnsSum)}

			setLastPlayerAlias(m.Alias)
			urlParams.set('lastplayer', m.Alias)
			updateURL(urlParams)

		})
		tmp_socket.on('UpdateGnadenwurf', (msg) => {

			setGnadenwurf(msg.Data)

		})

		return () => {
			tmp_socket.disconnect()
		}

	}, [])

	const newGame = () => {
	
		axiosPrivate.delete('/game',
			{
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true,
				params: { SessionID: sessionid },
			}
		).then(() => {

			socket.emit('EndGame', '')
			navigate('/creategame', { replace: true })

		}).catch((err) => {
			console.log(err)
		})
	
	}
	




	//__________________________________________________FinishGame/SaveResults__________________________________________________

	const finishGame = () => {
	
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

			const v = +document.getElementById(id_playerTable).querySelector(`[alias='${p.Alias}']`).textContent
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
		session.InputType = inputType
	
	
		//____________________FinalScore____________________
		const finalScores = { 
			PlayerScores: playerScores, 
			...createFinalScoreElement(session.Columns, Boolean(askIfSurrender), list_winnerAlias, playerScores) 
		}
		
		await axiosPrivate.post('/game',
			{
				...session,
				FinalScores: finalScores,
			},
			{
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		).then(() => {
	
			socket.emit('EndGame', '')
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

		if(session.id) {

			await axiosPrivate.post('/updatesession',
				{ id: session.id, List_Players: tmpListPlayers },
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			).catch((err) => {
				console.log(err)
				return
			})
		}

		socket.emit('RefreshGame', '')
		window.location.reload()

	}

	const modalEditShow = () => {

		setTmpListPlayers(session?.List_PlayerOrder.map((alias) => getPlayer(alias, session)))
		document.getElementById('modal-edit').showModal()

	}


	



	return (
		<>

			{/* __________________________________________________Dialogs__________________________________________________ */}

			<dialog id='modal-surrender' className='modal'>
				<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<svg onClick={closeSurrender} height='24' viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
				</div>

				<h1>Gewinner auswählen</h1>
				{askIfSurrender && <div>
					<label style={{ fontSize: '22px', }}>{`Sicher, dass ${getPlayer(askIfSurrender, session).Name} gewinnen soll?`}</label>
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
				</div>}

				<dl>
					{session?.List_Players?.map((p, i) => (
						<dt 
							className='listElement' 
							onClick={() => setAskIfSurrender(p.Alias)}
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
						<svg onClick={modalEditClose} className='button-responsive' height='24' viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
					</div>
					
					<h1>Bearbeiten</h1>

					{/* ______________________________ChangeNames______________________________ */}
					{/* To test the drag and drop function you have to disable/comment React.StrictMode in index.js */}

					<div
						style={{
							display: 'flex', 
							fontWeight: 'bold', 
						}}
					>
						<label style={{ marginLeft: '50px' }}>Beitrittscode</label>
						<label style={{ marginLeft: '30px' }}>{joincode}</label>
					</div>

					{tmpListPlayers && <DragAndDropNameColorList List_Players={tmpListPlayers} setList_Players={setTmpListPlayers}/>}

					<button className='button' onClick={modalEditSave} style={{ width: '100%' }}>Speichern</button>

				</div>
			</dialog>

			<dialog id='modal-nextPlayer' className='modal'>
				<p style={{ fontSize: '22px', marginTop: '20px' }}>
					{!lastPlayerAlias 
						? 'Bis jetzt war noch keiner dran!'
						: (
							<>
								{'\'' + getPlayer(lastPlayerAlias, session)?.Name + '\' war als letztes dran.'}<br />
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
						onChange={(e) => handleInputTypeChange(e.target.value, urlParams)}
						className='button'
						style={{
							fontSize: '13px', 
							borderRadius: '10px',
							height: '30px',
							padding: '5px',
							marginLeft: '5px',
							marginRight: '10px',
							marginTop: '0',
							marginBottom: '0',
							background: 'none', 
							border: '1px solid var(--text-color)',
							outline: 'none',
							color: 'var(--text-color)',
						}}
					>
					<option value='select' key='select'>Auswahl</option>
					<option value='typeselect' key='typeselect'>Auswahl und Eingabe</option>
					<option value='type' key='type'>Eingabe</option>
				</select>

				<svg onClick={modalEditShow} className='button-responsive' width='25' viewBox="0 -960 960 960" ><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>

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

			<PlayerTable 
				session={session}
				socket={socket}
				tableWidth={tableWidth}
				thickBorder={thickBorder}
				getPlayer={getPlayer}
				lastPlayerAlias={lastPlayerAlias}
				gnadenwurf={gnadenwurf}
				setGnadenwurf={setGnadenwurf}
			/>
			
			<Table 
				tableID={id_upperTable}
				session={session}
				tableColumns={tableColumns}
				getPlayer={getPlayer}
				inputType={inputType}
				onblurEvent={(e) => onblurEvent(e, setLastPlayerAlias, urlParams, socket, columnsSum)}
				removeFocusEvent={removeFocusEvent}
			/>
			<Table 
				tableID={id_bottomTable}
				session={session}
				tableColumns={tableColumns}
				getPlayer={getPlayer}
				inputType={inputType}
				onblurEvent={(e) => onblurEvent(e, setLastPlayerAlias, urlParams, socket, columnsSum)}
				removeFocusEvent={removeFocusEvent}
			/>

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

export default Game
