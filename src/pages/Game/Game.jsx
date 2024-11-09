

import './scss/Game.scss'

import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from '../../components/others/Popup'
import Table from '../../components/Tables/Table'
import Loader from '../../components/Loader/Loader'
import TablePlayer from '../../components/Tables/Table_Player'
import CustomButton from '../../components/others/Custom_Button'
import OptionsDialog from '../../components/others/OptionsDialog'
import DragAndDropNameColorList from '../../components/others/DragAndDropNameColorList'





export default function Game() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()


	const location = useLocation()
	const urlParams = new URLSearchParams(location.search)

	const [ session_id, setSession_id ] = useState()
	const [ lastPlayerAlias, setLastPlayerAlias ] = useState()
	
	const [ columnsSum ] = useState([])
	
	const [ user, setUser ] = useState()
	const [ session, setSession ] = useState()
	const [ list_players, setList_players ] = useState()

	const [ askIfSurrender, setAskIfSurrender ] = useState()	// index of the 'winner'

	const [ invalidNumberText, setInvalidNumberText ] = useState('')

	const [ show_edit, setShow_edit ] = useState(false)
	const [ show_newGame, setShow_newGame ] = useState(false)
	const [ show_options, setShow_options ] = useState(false)
	const [ show_surrender, setShow_surrender ] = useState(false)
	const [ show_finishGame, setShow_finishGame ] = useState(false)
	const [ show_lastPlayer, setShow_lastPlayer ] = useState(false)
	const [ show_invalidNumber, setShow_invalidNumber ] = useState(false)
	const [ show_finishGame_error, setShow_finishGame_error ] = useState(false)

	const [ loading_request, setLoading_request ] = useState(false)





	// useLayoutEffect(() => {
		
	// 	const ut = document.getElementById(id_upperTable)
	// 	if(!ut) return
	// 	setTableWidth(ut.offsetWidth)

	// })

	// useEffect(() => {

	// 	if(!session) return

	// 	const x = window.innerWidth / 2
	// 	const y = window.innerHeight / 2
	// 	window.scrollTo({
	// 		top: y,
	// 		left: x,
	// 		behavior: 'smooth'
	// 	})

	// 	for(const alias of session?.List_PlayerOrder) {
	// 		for(let i = 0; session?.Columns > i; i++) {
	// 			calculateUpperColumn(alias, i, columnsSum)
	// 			calculateBottomColumn(alias, i, columnsSum)
	// 		}
	// 	}

	// 	const elements = document.getElementsByClassName('kniffelInput')
	// 	if (elements) {
	// 		for(const e of elements) {
	// 			e.addEventListener('focus', focusEvent)
	// 			// if(session.InputType === '') {
	// 			// 	e.addEventListener('blur', (removeFocusEvent(e?.target?.closest('tr')), local_onBlurEvent(e)))
	// 			// } else {
	// 				e.addEventListener('blur', removeFocusEvent)
	// 			// }
	// 		}
	// 	}

	// 	return () => {
	// 		for(const e of elements) {
	// 			e.removeEventListener('focus', focusEvent)
	// 			e.removeEventListener('blur', (removeFocusEvent(e?.target?.closest('tr')), local_onBlurEvent(e)))
	// 		}
	// 	}

	// 	// eslint-disable-next-line
	// }, [ session ])

	useEffect(() => {


		const session_id = urlParams.get('session_id')
		const lastplayer = urlParams.get('lastplayer')

		setSession_id(+session_id)
		setLastPlayerAlias(lastplayer)


		if(!session_id) return navigate('/game/create', { replace: true })

		setLoading_request(true)

		axiosPrivate.get(`/game?session_id=${session_id}`).then(({ data }) => {
			
			
			setUser(data.User)
			setList_players(data.List_Players)
			setSession(data.Session)


		}).catch((err) => {

			handle_error({
				err, 
				handle_404: () => {
					window.alert('Die Session wurde nicht gefunden!')
					navigate('/session/select', { replace: true })
				},
			})
			
		}).finally(() => setLoading_request(false))

	}, [])

	const newGame = () => {
	
		axiosPrivate.delete(`/game?session_id=${session_id}`).then(() => {

			navigate('/session/select', { replace: true })

		}).catch((err) => {

			handle_error({ err })

		})
	
	}





	// __________________________________________________ FinishGame / SaveResults __________________________________________________

	const [ loading, setLoading ] = useState(false)

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
	
	const saveResults = () => {
		
		setLoading(true)

		if(list_players.length === 1) return navigate('/session/select', { replace: true })
	
		axiosPrivate.post('/game',
			{
				SessionID: session.id, 
				WinnerAlias: askIfSurrender,
				List_PlayerOrder: session.List_PlayerOrder,
				List_Players: list_players, 
			}
		).then(({ data }) => {

			navigate(`/game/end?session_id=${session.id}&finalscore_id=${data.FinalScoreID}`, { replace: true })

		}).catch((err) => {

			handle_error({
				err, 
				handle_409: () => {
					window.alert('Es gibt einen Synchronisations-Fehler!')
				}
			})

		}).finally(() => { setLoading(false) })
	
	}





	// __________________________________________________ Edit __________________________________________________

	const [ disable_edit, setDisable_edit ] = useState(false)
	const [ edit_list_players, setEdit_list_players ] = useState([])

	const show_edit_popup = () => {

		setEdit_list_players(list_players.map((p) => { return { ...p } })) 
		setShow_edit(true) 

	}

	const save_edit = () => {

		setDisable_edit(true)

		if(!session_id) return

		axiosPrivate.post('/session/update', 
			{ 
				SessionID: session_id, 
				List_Players: edit_list_players 
			}
		).then(() => {

			window.location.reload()

		}).catch((err) => {

			handle_error({
				err, 
				handle_404: () => {
					window.alert('Die Session wird nicht gefunden!')
					navigate('/session/select', { replace: true })
				}
			})

		}).finally(() => {setDisable_edit(false)})
			
	}


	





	if(loading_request) return <Loader loaderVisible={true}/>

	return (<>

		<OptionsDialog/>



		<div className='game_container'>
			<div className='game'>

				<TablePlayer 
					session={session}
					list_players={list_players}
					setList_players={setList_players}
				/>

				<Table 
					session={session}
					list_players={list_players}
					setList_players={setList_players}
				/>

				<footer>

					<button
						onClick={() => setShow_options(true)}
						className='button options'
					>
						<svg viewBox='0 -960 960 960'><path d='m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z'/></svg>
					</button>

					<button 
						onClick={finishGame}
						className='button'
					>Spiel beenden</button>

				</footer>
				
			</div>
		</div>

			








		{/* __________________________________________________ Popup Options __________________________________________________ */}

		{/* <Popup
			title='Einstellungen'
			showPopup={show_options}
			setShowPopup={setShow_options}
		>
			<div className='game_popup-options'>

				<section>
					<label>Eingabetyp</label>

					<select
						value={inputType}
						onChange={handleInputTypeChange}
					>
						<option value='select' key='select'>Auswahl</option>
						<option value='typeselect' key='typeselect'>Auswahl und Eingabe</option>
						<option value='type' key='type'>Eingabe</option>
					</select>
				</section>

				<section>
					<label>Bearbeiten</label>

					<svg 
						onClick={show_edit_popup} 
						className='button-responsive' 
						viewBox='0 -960 960 960' 
					><path d='M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z'/></svg>
				</section>

				<section>
					<button 
						className='button button-red-reverse'
						onClick={() => setShow_surrender(true)}
					>Aufgeben</button>
				</section>

				<section>
					<button 
						onClick={() => setShow_newGame(true)} 
						className='button button-reverse'
					>Neues Spiel</button>
				</section>

			</div>
		</Popup> */}





		{/* __________________________________________________ Popup Surrender __________________________________________________ */}

		{/* <Popup
			showPopup={show_surrender}
			setShowPopup={setShow_surrender}
			title='Gewinner auswählen'
		>
			<div className='game_popup-surrender'>

				{askIfSurrender ? <>

					<div className='askifsurrender'>

						<h2>{`Sicher, dass ${getPlayer(askIfSurrender, list_players).Name} gewinnen soll?`}</h2>

						<CustomButton
							loading={loading}
							text='Ja'
							onClick={saveResults}
						/>

						<button 
							className='button button-red-reverse' 
							onClick={() => setAskIfSurrender()}
						>Abbrechen</button>
					</div>

				</>:<>
				
					<div className='list-container'>
						<ul>
							{list_players?.map((p, i) => (
								<li className='responsive' key={i} onClick={() => setAskIfSurrender(p.Alias)}>
									<label>{p.Name}</label>
								</li>
							))}
						</ul>
					</div>

				</>}

			</div>
		</Popup> */}







		{/* __________________________________________________ Popup Edit __________________________________________________ */}

		<Popup
			showPopup={show_edit}
			setShowPopup={setShow_edit}
			title='Bearbeiten'
		>
			<div className='game_popup-edit'>

				{/* ______________________________ ChangeNames ______________________________ */}
				{/* To test the drag and drop function you have to disable/comment React.StrictMode in index.js */}

				{/* <div className='show-sum'>
					<label>Gesamtsumme anzeigen</label>
					<ToggleSlider 
						toggled={showScores}
						onChange={() => {handleShowScoresChange(!showScores, urlParams); setShowScores(!showScores)}}
					/>
				</div> */}

				<div className='list-container'>
					{list_players && <DragAndDropNameColorList List_Players={edit_list_players} setList_Players={setEdit_list_players}/>}
				</div>

				<button 
					className='button button-thick' 
					onClick={save_edit} 
					disabled={disable_edit}
				>Speichern</button>
			
			</div>
		</Popup>







		{/* __________________________________________________ Popup NewGame  __________________________________________________ */}

		<Popup
			showPopup={show_newGame}
			setShowPopup={setShow_newGame}
			title={`Dieses Spiel löschen und ein neues Spiel anfangen?`}
		>

			<button 
				className='button' 
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
			title='Spiel beenden?'
		>

			<CustomButton
				onClick={saveResults}
				loading={loading}
				text='Ja'
			/>

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
			title={invalidNumberText}
		>

			<button 
				className='button button-thick' 
				onClick={() => setShow_invalidNumber(false)}
			>Ok</button>
		
		</Popup>







		{/* __________________________________________________ Popup LastPlayer __________________________________________________ */}

		{/* <Popup
			showPopup={show_lastPlayer}
			setShowPopup={setShow_lastPlayer}
			title={!lastPlayerAlias 
					? 'Bis jetzt war noch keiner dran!'
					: (<>
						{'\'' + getPlayer(lastPlayerAlias, list_players)?.Name + '\' war als letztes dran.'}
					</>)
				}
		>

			<button 
				className='button' 
				onClick={() => setShow_lastPlayer(false)}
			>Ok</button>

		</Popup> */}

	</>)
}
