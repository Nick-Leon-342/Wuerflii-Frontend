

import './css/Game.css'

import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { id_bottomTable, id_upperTable, thickBorder, getPlayer, updateURL, handleShowScoresChange, handleInputTypeChange, successfullyConnected } from '../logic/utils'
import { focusEvent, removeFocusEvent, onblurEvent } from '../logic/Events'
import Loader from '../components/Loader'
import DragAndDropNameColorList from '../components/DragAndDropNameColorList'
import { calculateUpperColumn, calculateBottomColumn } from '../logic/Calculating'

import PlayerTable from '../components/PlayerTable'
import Table from '../components/Table'
import ToggleSlider from '../components/ToggleSlider'
import OptionsDialog from '../components/Dialog/OptionsDialog'
import Popup from '../components/Popup'





export default function Game() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	
	const [ sentDataPackages ] = useState(JSON.parse(localStorage.getItem('kniffel_sentDataPackages')) || [])

	const location = useLocation()
	const urlParams = new URLSearchParams(location.search)
	const joincode = urlParams.get('joincode')
	const sessionid = urlParams.get('sessionid')
	const [ lastPlayerAlias, setLastPlayerAlias ] = useState(urlParams.get('lastplayer'))
	
	const [ columnsSum ] = useState([])
	
	const [ session, setSession ] = useState()

	const [ inputType, setInputType ] = useState()
	const [ showScores, setShowScores ] = useState()
	const [ tableWidth, setTableWidth ] = useState(0)
	const [ gnadenwurf, setGnadenwurf ] = useState({})	// Gnadenwurf is an extra try
	const [ tableColumns, setTableColumns ] = useState([])
	const [ loaderVisible, setLoaderVisible ] = useState(false)

	const [ askIfSurrender, setAskIfSurrender ] = useState()	// index of the 'winner'

	const [ invalidNumberText, setInvalidNumberText ] = useState('')

	const [ show_surrender, setShow_surrender ] = useState(false)
	const [ show_edit, setShow_edit ] = useState(false)
	const [ show_newGame, setShow_newGame ] = useState(false)
	const [ show_finishGame, setShow_finishGame ] = useState(false)
	const [ show_finishGame_error, setShow_finishGame_error ] = useState(false)
	const [ show_invalidNumber, setShow_invalidNumber ] = useState(false)
	const [ show_lastPlayer, setShow_lastPlayer ] = useState(false)


	


	const local_onBlurEvent = ( element ) => {

		onblurEvent(element, setLastPlayerAlias, urlParams, axiosPrivate, navigate, joincode, columnsSum, setShow_invalidNumber, setInvalidNumberText)

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
				calculateUpperColumn(alias, i, columnsSum)
				calculateBottomColumn(alias, i, columnsSum)
			}
		}

		const elements = document.getElementsByClassName('kniffelInput')
		if (elements) {
			for(const e of elements) {
				e.addEventListener('focus', focusEvent)
				if(inputType === 0) {
					e.addEventListener('blur', (removeFocusEvent(e?.target?.closest('tr')), local_onBlurEvent(e)))
				} else {
					e.addEventListener('blur', removeFocusEvent)
				}
			}
		}

		return () => {
			for(const e of elements) {
				e.removeEventListener('focus', focusEvent)
				e.removeEventListener('blur', (removeFocusEvent(e?.target?.closest('tr')), local_onBlurEvent(e)))
			}
		}

	}, [session])

	useEffect(() => {

		if(!sessionid || !joincode) return navigate('/creategame', { replace: true })

		axiosPrivate.get(`/game?sessionid=${sessionid}&joincode=${joincode}`,
			{
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		).then((res) => {
			
			successfullyConnected(
				res.data, 
				columnsSum, 
				urlParams, 
				setSession, 
				setInputType, 
				setShowScores, 
				setTableColumns, 
				setGnadenwurf, 
			)

		}).catch(() => {
			return navigate('/creategame', { replace: true })
		})

		// const tmp_socket = io.connect(REACT_APP_BACKEND_URL, { auth: { joincode: joincode } })
		// setSocket(tmp_socket)
		// tmp_socket.emit('JoinSession', '')
		// tmp_socket.on('UpdateValueResponse', (msg) => {

		// 	const m = msg.Data
		// 	const tableID = m.UpperTable ? id_upperTable : id_bottomTable

		// 	document.getElementById(tableID).querySelector(`.kniffelInput[alias='${m.Alias}'][column='${m.Column}'][row='${m.Row}']`).value = m.Value
			
		// 	for(const e of tableColumns) {
		// 		if(e.TableID === tableID && e.Alias === m.Alias && e.Column === m.Column) {
		// 			e[m.Row] = m.Value
		// 		}
		// 	}

		// 	if(m.UpperTable) {calculateUpperColumn(m.Alias, m.Column, columnsSum)
		// 	} else {calculateBottomColumn(m.Alias, m.Column, columnsSum)}

		// 	setLastPlayerAlias(m.Alias)
		// 	urlParams.set('lastplayer', m.Alias)
		// 	updateURL(urlParams)

		// })
		// tmp_socket.on('UpdateGnadenwurf', (msg) => {

		// 	setGnadenwurf(msg.Data)

		// })

		// return () => {
		// 	tmp_socket.disconnect()
		// }

	}, [])

	const newGame = () => {
	
		axiosPrivate.delete('/game',
			{
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true,
				params: { SessionID: sessionid },
			}
		).then(() => {

			navigate('/creategame', { replace: true })

		}).catch((err) => {
			console.log(err)
		})
	
	}
	




	// __________________________________________________ FinishGame / SaveResults __________________________________________________

	const [ disable_save, setDisable_save ] = useState(false)

	const finishGame = () => {
	
		if(!askIfSurrender) {
			for(const element of columnsSum) {
				if(element.All === '0' || element.All === 0) {
					setShow_finishGame_error(true)
					return
				}
			}
		}

		setShow_finishGame(true)

	}
	
	const saveResults = async () => {
		
		setLoaderVisible(true)
		setDisable_save(true)

		if(session.List_Players.length === 1) return navigate('/selectsession', { replace: true })
	
		await axiosPrivate.post('/game',
			{
				SessionID: session.id, 
				JoinCode: joincode, 
				WinnerAlias: askIfSurrender,
				List_PlayerOrder: session.List_PlayerOrder,
				List_Players: session.List_Players, 
			}
		).then(({ data }) => {

			navigate(`/endscreen?sessionid=${session.id}&winner=${JSON.stringify(data.List_WinnerNames)}&playerscores=${JSON.stringify(data.PlayerScores)}`, { replace: true })
			setLoaderVisible(false)

		}).catch((err) => {

			if(err.response.status === 409) {
				window.alert('Es gibt einen Synchronisations-Fehler!')
			} else {
				console.log(err)
			}

		})

		setDisable_save(false)
	
	}





	// __________________________________________________ Edit __________________________________________________

	const [ list_players, setList_players ] = useState()
	const [ disable_edit, setDisable_edit ] = useState(false)

	const save_edit = async () => {

		setDisable_edit(true)

		if(!session.id) return

		await axiosPrivate.post('/updatesession',{ id: session.id, List_Players: list_players }).then(() => {

			//TODO
			// socket.emit('RefreshGame', '')
			window.location.reload()

		}).catch((err) => {
			console.log(err)
		})
		
		setDisable_edit(false)

	}


	



	return (
		<>

			{/* __________________________________________________ Dialogs __________________________________________________ */}

			<OptionsDialog/>





			{/* __________________________________________________ Page __________________________________________________ */}

			<div className='game_header-bar'>

				<select
						value={inputType}
						onChange={(e) => handleInputTypeChange(e.target.value, urlParams)}
					>
					<option value='select' key='select'>Auswahl</option>
					<option value='typeselect' key='typeselect'>Auswahl und Eingabe</option>
					<option value='type' key='type'>Eingabe</option>
				</select>

				<svg onClick={() => { setList_players(session?.List_Players.map((p) => { return { ...p } })); setShow_edit(true) }} className='button-responsive' viewBox='0 -960 960 960' ><path d='M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z'/></svg>

				<button 
					className='button'
					onClick={() => setShow_surrender(true)}
				>Aufgeben</button>

			</div>



			<PlayerTable 
				list_Players={session?.List_Players}
				axiosPrivate={axiosPrivate}
				joincode={+joincode}
				tableWidth={tableWidth}
				thickBorder={thickBorder}
				lastPlayerAlias={lastPlayerAlias}
				gnadenwurf={gnadenwurf}
				setGnadenwurf={setGnadenwurf}
				showScores={showScores}
				sentDataPackages={sentDataPackages}
				setShow_lastPlayer={setShow_lastPlayer}
			/>
			
			<Table 
				tableID={id_upperTable}
				columns={session?.Columns}
				list_Players={session?.List_Players}
				tableColumns={tableColumns}
				inputType={inputType}
				onblurEvent={local_onBlurEvent}
				removeFocusEvent={removeFocusEvent}
			/>
			<Table 
				tableID={id_bottomTable}
				columns={session?.Columns}
				list_Players={session?.List_Players}
				tableColumns={tableColumns}
				inputType={inputType}
				onblurEvent={local_onBlurEvent}
				removeFocusEvent={removeFocusEvent}
			/>



			<div className='game_footer-bar'>

				<button 
					onClick={() => setShow_newGame(true)} 
					className='button'
				>Neues Spiel</button>

				<button 
					onClick={finishGame}
					className='button button-thick'
				>Spiel beenden</button>
				
			</div>










			{/* __________________________________________________ Popup Surrender __________________________________________________ */}

			<Popup
				showPopup={show_surrender}
				setShowPopup={setShow_surrender}
			>

				<h1>Gewinner auswählen</h1>

				{askIfSurrender ? <>

					<div className='game_popup_surrender_askifsurrender'>

						<h2>{`Sicher, dass ${getPlayer(askIfSurrender, session).Name} gewinnen soll?`}</h2>

						<button 
								className='button button-thick' 
								disabled={disable_save}
								onClick={saveResults}
							>Ja</button>

							<button 
								className='button button-red-reverse' 
								onClick={() => setAskIfSurrender()}
							>Abbrechen</button>
					</div>

				</>:<>
				
					<ul className='game_popup_surrender_list'>
						{session?.List_Players?.map((p, i) => (
							<li className='responsive' key={i} onClick={() => setAskIfSurrender(p.Alias)}>
								<label>{p.Name}</label>
							</li>
						))}
					</ul>

				</>}

			</Popup>







			{/* __________________________________________________ Popup Edit __________________________________________________ */}

			<Popup
				showPopup={show_edit}
				setShowPopup={setShow_edit}
			>

				<h1>Bearbeiten</h1>

				{/* ______________________________ ChangeNames ______________________________ */}
				{/* To test the drag and drop function you have to disable/comment React.StrictMode in index.js */}

				<div className='game_popup_edit_container'>
					<label>Beitrittscode</label>
					<label style={{ marginLeft: '27px' }}>{joincode}</label>
				</div>

				<div className='game_popup_edit_container'>
					<label>Gesamtsumme anzeigen</label>
					<ToggleSlider scale='.9' marginLeft='20px' toggled={showScores} setToggled={() => {handleShowScoresChange(!showScores, urlParams); setShowScores(!showScores)}}/>
				</div>

				{list_players && <DragAndDropNameColorList List_Players={list_players} setList_Players={setList_players}/>}

				<button 
					className='button button-thick' 
					onClick={save_edit} 
					disabled={disable_edit}
				>Speichern</button>

			</Popup>







			{/* __________________________________________________ Popup Edit __________________________________________________ */}

			<Popup
				showPopup={show_newGame}
				setShowPopup={setShow_newGame}
			>

				<h1>Dieses Spiel löschen<br/>und ein neues Spiel anfangen?</h1>

				<button 
					className='button button-thick' 
					onClick={newGame}
				>Ja</button>

				<button 
					className='button button-red-reverse' 
					onClick={() => setShow_newGame(false)}
				>Abbrechen</button>

			</Popup>







			{/* __________________________________________________ Popup FinishGame __________________________________________________ */}

			<Popup
				showPopup={show_finishGame}
				setShowPopup={setShow_finishGame}
			>

				<h1>Spiel beenden?</h1>

				<Loader loaderVisible={loaderVisible}/>

				<button 
					className='button button-thick' 
					disabled={disable_save}
					onClick={saveResults}
				>Ja</button>

				<button 
					className='button button-red-reverse' 
					onClick={() => setShow_finishGame(false)}
				>Abbrechen</button>

			</Popup>







			{/* __________________________________________________ Popup FinishGame-Error __________________________________________________ */}

			<Popup
				showPopup={show_finishGame_error}
				setShowPopup={setShow_finishGame_error}
			>

				<h1>Bitte alle Werte eingeben!</h1>

				<button 
					className='button button-thick' 
					onClick={() => setShow_finishGame_error(false)}
				>Verstanden</button>

			</Popup>







			{/* __________________________________________________ Popup InvalidNumber __________________________________________________ */}

			<Popup
				showPopup={show_invalidNumber}
				setShowPopup={setShow_invalidNumber}
			>
	
				<h1 className='game_popup_invalidNumber'>{invalidNumberText}</h1>

				<button 
					className='button button-thick' 
					onClick={() => setShow_invalidNumber(false)}
				>Ok</button>
			
			</Popup>







			{/* __________________________________________________ Popup LastPlayer __________________________________________________ */}

			<Popup
				showPopup={show_lastPlayer}
				setShowPopup={setShow_lastPlayer}
			>

				<h1>
					{!lastPlayerAlias 
						? 'Bis jetzt war noch keiner dran!'
						: (<>
							{'\'' + getPlayer(lastPlayerAlias, session)?.Name + '\' war als letztes dran.'}
						</>)
					}
				</h1>

				<button 
					className='button button-thick' 
					onClick={() => setShow_lastPlayer(false)}
				>Ok</button>

			</Popup>


		</>
	)
}
