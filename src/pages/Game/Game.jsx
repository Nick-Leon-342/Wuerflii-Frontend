

import './scss/Game.scss'

import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from '../../components/others/Popup'
import Loader from '../../components/Loader/Loader'
import Table from '../../components/Game/Game_Tables/Table'
import GameOptions from '../../components/Game/Game_Options'
import CustomButton from '../../components/others/Custom_Button'
import OptionsDialog from '../../components/others/OptionsDialog'
import TablePlayer from '../../components/Game/Game_Tables/Table_Player'
import DragAndDropNameColorList from '../../components/others/DragAndDropNameColorList'





export default function Game() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()


	const location = useLocation()
	
	const [ user, setUser ] = useState()
	const [ session, setSession ] = useState()
	const [ list_players, setList_players ] = useState()

	const [ loading_request, setLoading_request ] = useState(false)
	const [ loading_finish_game, setLoading_finish_game ] = useState(false)

	const [ surrender_winner, setSurrender_winner ] = useState()	// Player-Object of the 'winner'

	const [ show_edit, setShow_edit ] = useState(false)
	const [ show_options, setShow_options ] = useState(false)
	const [ show_surrender, setShow_surrender ] = useState(false)





	useEffect(() => {

		const session_id = new URLSearchParams(location.search).get('session_id')

		if(!session_id) return navigate('/game/create', { replace: true })

		setLoading_request(true)

		axiosPrivate.get(`/game?session_id=${session_id}`).then(({ data }) => {
			
			
			setUser(data.User)
			setList_players(data.List_Players)
			setSession(data.Session)

			setTimeout(() => {
				window.scrollTo({ top: 1500, left: 1250, behavior: 'smooth' })
			}, 50)


		}).catch((err) => {

			handle_error({
				err, 
				handle_404: () => {
					window.alert('Die Session wurde nicht gefunden!')
					navigate('/session/select', { replace: true })
				},
			})
			
		}).finally(() => setLoading_request(false))

		

		// eslint-disable-next-line
	}, [])

	const finish_game = () => {
	
		if(!surrender_winner && list_players.some(p => p.List_Table_Columns.some(tc => !tc.Bottom_Table_TotalScore))) return alert('Bitte alle Werte angeben.')	
		if(list_players.length === 1) return navigate('/session/select', { replace: true })
			
		setLoading_finish_game(true)
	
		const json = { SessionID: session.id }
		if(surrender_winner) json.Surrendered_PlayerID = surrender_winner.id

		axiosPrivate.post('/game', json).then(({ data }) => {

			navigate(`/game/end?session_id=${session.id}&finalscore_id=${data.FinalScoreID}`, { replace: true })

		}).catch((err) => {

			handle_error({
				err, 
				handle_409: () => alert('Bitte alle Werte eingeben.')
			})

		}).finally(() => setLoading_finish_game(false))
	
	}





	// __________________________________________________ Edit __________________________________________________

	const [ disable_edit, setDisable_edit ] = useState(false)
	const [ edit_list_players, setEdit_list_players ] = useState([])

	const save_edit = () => {

		setDisable_edit(true)

		if(!session.id) return

		axiosPrivate.post('/session/update', 
			{ 
				SessionID: session.id, 
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

		}).finally(() => setDisable_edit(false))
			
	}


	





	if(loading_request) return <Loader loaderVisible={true}/>

	return (<>

		<OptionsDialog
			user={user}
			setUser={setUser}
		/>



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
						className='button button-reverse button-responsive options'
					><svg viewBox='0 -960 960 960'><path d='m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z'/></svg></button>

					<CustomButton 
						loading={loading_finish_game}
						text='Spiel beenden'
						onClick={finish_game}
					/>

				</footer>
				
			</div>
		</div>

			








		{/* __________________________________________________ Options __________________________________________________ */}

		<GameOptions
			show_options={show_options}
			setShow_options={setShow_options}

			session={session}
			setSession={setSession}
			list_players={list_players}
			
			setShow_edit={setShow_edit}
			setShow_surrender={setShow_surrender}
			setEdit_list_players={setEdit_list_players}
		/>





		{/* __________________________________________________ Popup Surrender __________________________________________________ */}

		<Popup
			showPopup={show_surrender}
			setShowPopup={setShow_surrender}
			title='Gewinner auswählen'
		>
			<div className='game_popup-surrender'>

				{surrender_winner ? <>

					<div className='askifsurrender'>

						<h2>{`Sicher, dass ${surrender_winner.Name} gewinnen soll?`}</h2>

						<CustomButton
							loading={loading_finish_game}
							text='Ja'
							onClick={finish_game}
						/>

						<button 
							className='button button-red-reverse' 
							onClick={() => setSurrender_winner()}
						>Abbrechen</button>
					</div>

				</>:<>
				
					<div className='list-container'>
						<ul>
							{list_players?.map((player, index_player) => (
								<li 
									className='responsive' 
									key={index_player} 
									onClick={() => setSurrender_winner(player)}
								><label>{player.Name}</label></li>
							))}
						</ul>
					</div>

				</>}

			</div>
		</Popup>







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

	</>)
}
