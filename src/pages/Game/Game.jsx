

import './scss/Game.scss'

import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from '../../components/Popup/Popup'
import Loader from '../../components/Loader/Loader'
import Table from '../../components/Game/Game_Tables/Table'
import GameOptions from '../../components/Game/Game_Options'
import CustomButton from '../../components/others/Custom_Button'
import OptionsDialog from '../../components/Popup/Popup_Options'
import TablePlayer from '../../components/Game/Game_Tables/Table_Player'

import { ReactComponent as Settings } from '../../svg/Settings.svg'





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

	const [ show_options, setShow_options ] = useState(false)
	const [ show_surrender, setShow_surrender ] = useState(false)





	useEffect(() => {

		const session_id = new URLSearchParams(location.search).get('session_id')

		if(!session_id) return navigate('/', { replace: true })

		setLoading_request(true)

		axiosPrivate.get(`/game?session_id=${session_id}`).then(({ data }) => {
			
			
			setUser(data.User)
			setList_players(data.List_Players)
			setSession(data.Session)

			setTimeout(() => window.scrollTo({ top: 1500, left: 1250, behavior: 'smooth' }), 50)


		}).catch((err) => {

			handle_error({
				err, 
				handle_404: () => navigate('/', { replace: true }),
			})
			
		}).finally(() => setLoading_request(false))

		

		// eslint-disable-next-line
	}, [])

	const finish_game = () => {
	
		if(!surrender_winner && list_players.some(p => p.List_Table_Columns.some(tc => !tc.Bottom_Table_TotalScore))) return alert('Bitte alle Werte angeben.')	
		if(list_players.length === 1) return navigate('/', { replace: true })
			
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


	





	if(loading_request) return <Loader loading={true}/>

	return <>

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
						className='button button_reverse button_scale_3 options'
					><Settings/></button>

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
			setShow_surrender={setShow_surrender}

			setShow_options={setShow_options}
			show_options={show_options}

			session={session}
			setSession={setSession}
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
							className='button button_reverse_red' 
							onClick={() => setSurrender_winner()}
						>Abbrechen</button>
					</div>

				</>:<>
				
					<div className='list-container'>
						<ul>
							{list_players?.map((player, index_player) => (
								<li 
									className='button_scale_0 box' 
									key={index_player} 
									tabIndex={0}
									onClick={() => setSurrender_winner(player)}
								><label>{player.Name}</label></li>
							))}
						</ul>
					</div>

				</>}

			</div>
		</Popup>

	</>
}
