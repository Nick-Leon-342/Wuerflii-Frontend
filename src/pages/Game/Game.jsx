

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
import { useQuery } from '@tanstack/react-query'
import { get__user } from '../../api/user'
import { get__session } from '../../api/session/session'
import { get__session_players } from '../../api/session/session_players'
import { get__table_columns } from '../../api/table_columns'





export default function Game() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()


	const location = useLocation()
	const session_id = new URLSearchParams(location.search).get('session_id')
	
	// const [ user, setUser ] = useState()
	// const [ session, setSession ] = useState()
	const [ list_players, setList_players ] = useState()
	const [ list_table_columns, setList_table_columns ] = useState()

	const [ loading_request, setLoading_request ] = useState(false)
	const [ loading_finish_game, setLoading_finish_game ] = useState(false)

	const [ surrender_winner, setSurrender_winner ] = useState()	// Player-Object of the 'winner'

	const [ show_options, setShow_options ] = useState(false)
	const [ show_surrender, setShow_surrender ] = useState(false)




	// __________________________________________________ Queries __________________________________________________
		
	// ____________________ User ____________________

	const { data: user, isLoading: isLoading__user, isError: isError__user } = useQuery({
		queryKey: [ 'user' ], 
		queryFn: () => get__user(axiosPrivate), 
	})
	
	
	// ____________________ Session ____________________

	const { data: session, isLoading: isLoading__session, isError: isError__session } = useQuery({
		queryKey: [ 'session', +session_id ], 
		queryFn: () => get__session(axiosPrivate, session_id), 
	})
	

	// ____________________ List_Players ____________________

	const { data: tmp__list_players, isLoading: isLoading__list_players, isError: isError__list_players } = useQuery({
		queryKey: [ 'session', +session_id, 'players' ], 
		queryFn: () => get__session_players(axiosPrivate, session_id), 
	})

	useEffect(() => setList_players(tmp__list_players), [ tmp__list_players ])
	

	// ____________________ List_Table_Columns ____________________

	const { data: tmp__list_table_columns, isLoading: isLoading__list_table_columns, isError: isError__list_table_columns } = useQuery({
		queryKey: [ 'session', +session_id, 'table_columns' ], 
		queryFn: () => get__table_columns(axiosPrivate, session_id), 
	})

	useEffect(() => setList_table_columns(tmp__list_table_columns), [ tmp__list_table_columns ])





	useEffect(() => {

		if(!session_id) return navigate('/', { replace: true })
		
		setTimeout(() => window.scrollTo({ top: 1500, left: 1250, behavior: 'smooth' }), 50)

		// eslint-disable-next-line
	}, [ session ])

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

		<OptionsDialog user={user}/>



		<div className='game_container'>
			<div className='game'>

				<TablePlayer 
					session={session}
					list_players={list_players}
					setList_players={setList_players}
					list_table_columns={list_table_columns}
				/>

				<Table 
					session={session}
					list_players={list_players}
					list_table_columns={list_table_columns}
					setList_table_columns={setList_table_columns}
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
			// setSession={setSession} // TODO
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
