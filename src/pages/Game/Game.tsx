

import './scss/Game.scss'

import { useContext, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from '../../components/Popup/Popup'
import Table from '../../components/Game/Game_Tables/Table'
import Game_Options from '../../components/Game/Game_Options'
import CustomButton from '../../components/misc/Custom_Button'
import OptionsDialog from '../../components/Popup/Popup__Options'
import Table_Player from '../../components/Game/Game_Tables/Table_Player'
import Context__Universal_Loader from '../../Provider_And_Context/Provider_And_Context__Universal_Loader'

import Settings from '../../svg/Settings.svg?react'

import { get__user } from '../../api/user'
import { get__session } from '../../api/session/session'
import { get__table_columns } from '../../api/table_columns'
import { get__session_players } from '../../api/session/session_players'
import type { Type__Server_Reponse__Player__Get } from '../../types/Type__Server_Response/Type__Server_Response__Player__GET'
import type { Type__Server_Response__Table_Columns__Get } from '../../types/Type__Server_Response/Type__Server_Response__Table_Columns__GET'





export default function Game() {

	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { setLoading__universal_loader } = useContext(Context__Universal_Loader)

	const location = useLocation()
	const session_id = new URLSearchParams(location.search).get('session_id')
	
	const [ list_players,			setList_players			] = useState<Array<Type__Server_Reponse__Player__Get>>([])
	const [ list__table_columns, 	setList_table_columns	] = useState<Array<Type__Server_Response__Table_Columns__Get>>([])

	const [ loading_finish_game, 	setLoading_finish_game	] = useState<boolean>(false)

	const [ surrender_winner, 		setSurrender_winner		] = useState<Type__Server_Reponse__Player__Get>()	// Player-Object of the 'winner'

	const [ show_options, 			setShow_options			] = useState(false)
	const [ show_surrender, 		setShow_surrender		] = useState(false)





	// __________________________________________________ Queries __________________________________________________
		
	// ____________________ User ____________________

	const { data: user, isLoading: isLoading__user, error: error__user } = useQuery({
		queryKey: [ 'user' ], 
		queryFn: () => get__user(axiosPrivate), 
	})

	if(error__user) {
		handle_error({
			err: error__user, 
		})
	}
	
	
	// ____________________ Session ____________________

	const { data: session, isLoading: isLoading__session, error: error__session } = useQuery({
		queryKey: [ 'session', +(session_id || -1) ], 
		queryFn: () => get__session(axiosPrivate, +(session_id || -1)), 
	})

	if(error__session) {
		handle_error({
			err: error__session, 
			handle_404: () => {
				alert('Die Partie wurde nicht gefunden.')
				navigate('/', { replace: true })
			}
		})
	}
	

	// ____________________ List__Players ____________________

	const { data: tmp__list_players, isLoading: isLoading__list_players, error: error__list_players } = useQuery({
		queryKey: [ 'session', +(session_id || -1), 'players' ], 
		queryFn: () => get__session_players(axiosPrivate, +(session_id || -1)), 
	})

	if(error__list_players) {
		handle_error({
			err: error__list_players, 
			handle_404: () => {
				alert('Die Partie wurde nicht gefunden.')
				navigate('/', { replace: true })
			}
		})
	}

	useEffect(() => { 
		function init() {
			if(tmp__list_players) setList_players(tmp__list_players)
		}
		init()
	}, [ tmp__list_players ])
	

	// ____________________ List__Table_Columns ____________________

	const { data: tmp__list__table_columns, isLoading: isLoading__list__table_columns, error: error__list__table_columns } = useQuery({
		queryKey: [ 'session', +(session_id || -1), 'table_columns' ], 
		queryFn: () => get__table_columns(axiosPrivate, +(session_id || -1)), 
	})

	if(error__list__table_columns) {
		handle_error({
			err: error__list__table_columns, 
			handle_404: () => {
				alert('Eine Ressource wurde nicht gefunden.')
				navigate('/', { replace: true })
			}
		})
	}

	useEffect(() => {
		function init() {
			if(tmp__list__table_columns) setList_table_columns(tmp__list__table_columns)
		}
		init()
	}, [ tmp__list__table_columns ])





	useEffect(() => setLoading__universal_loader(isLoading__user || isLoading__session || isLoading__list_players || isLoading__list__table_columns), [ setLoading__universal_loader, isLoading__user, isLoading__session, isLoading__list_players, isLoading__list__table_columns ])

	useEffect(() => {

		if(!session_id) navigate('/', { replace: true })
		
		setTimeout(() => window.scrollTo({ top: 1500, left: 1250, behavior: 'smooth' }), 50)

	}, [ session ]) // eslint-disable-line

	const finish_game = () => {
	
		if(!session || !list_players || !list__table_columns) return

		if(!surrender_winner && list__table_columns.some(table_column => table_column.List__Table_Columns.some(tc => !tc.Bottom_Table_TotalScore))) return alert('Bitte alle Werte angeben.')	
		if(list_players.length === 1) return navigate('/', { replace: true })

		setLoading_finish_game(true)

		axiosPrivate.post('/game', { 
			SessionID: session.id, 
			Surrendered_PlayerID: surrender_winner?.id
		}).then(({ data }) => {

			query_client.removeQueries({
				queryKey: [ 'session', session.id, 'table_columns' ]
			})
			navigate(`/game/end?session_id=${session.id}&finalscore_id=${data.FinalScoreID}`, { replace: true })

		}).catch((err) => {

			handle_error({
				err, 
				handle_409: () => alert('Bitte alle Werte eingeben.')
			})

		}).finally(() => setLoading_finish_game(false))
	
	}





	return <>

		<OptionsDialog user={user}/>



		{/* __________________________________________________ Game __________________________________________________ */}

		<div className='game-container'>
			<div className='game'>

				{session && <>
					<Table_Player 
						disabled={false}
						session={session}
						list_players={list_players}
						setList_players={setList_players}
						list__table_columns={list__table_columns}
					/>
				</>}

				<Table 
					disabled={false}
					session={session}
					list_players={list_players}
					list__table_columns={list__table_columns}
					setList_table_columns={setList_table_columns}
				/>

				<footer>

					<button
						onClick={() => setShow_options(true)}
						className='button button_reverse button_scale_3 options'
					><Settings/></button>

					<CustomButton 
						text='Spiel beenden'
						onClick={finish_game}
						loading={loading_finish_game}
					/>

				</footer>
				
			</div>
		</div>



		{/* __________________________________________________ Options __________________________________________________ */}

		{session && <>
			<Game_Options
				setShow_surrender={setShow_surrender}
	
				setShow_options={setShow_options}
				show_options={show_options}
	
				session={session}
			/>
		</>}



		{/* __________________________________________________ Popup Surrender __________________________________________________ */}

		<Popup
			show_popup={show_surrender}
			setShow_popup={setShow_surrender}
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
							onClick={() => setSurrender_winner(undefined)}
						>Abbrechen</button>
					</div>

				</>:<>
				
					<div className='list-container'>
						<ul>
							{list_players?.map((player, index_player) => (
								<li 
									className='button_scale_0 box' 
									style={{ backgroundColor: player.Color }}
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
