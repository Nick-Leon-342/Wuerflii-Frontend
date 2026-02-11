

import './scss/Game.scss'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useErrorHandling from '../../hooks/useErrorHandling'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import Context__Universal_Loader from '../../Provider_And_Context/Provider_And_Context__Universal_Loader'
import Table_Player from '../../components/Game/Game_Tables/Table_Player'
import OptionsDialog from '../../components/Popup/Popup__Options'
import CustomButton from '../../components/misc/Custom_Button'
import Game_Options from '../../components/Game/Game_Options'
import Table from '../../components/Game/Game_Tables/Table'
import Popup from '../../components/Popup/Popup'

import Settings from '../../svg/Settings.svg?react'

import { get__session_players } from '../../api/session/session_players'
import { get__table_columns } from '../../api/table_columns'
import { get__session } from '../../api/session/session'
import { get__user } from '../../api/user'

import type { Type__Server_Response__Table_Columns__Get } from '../../types/Type__Server_Response/Type__Server_Response__Table_Columns__GET'
import type { Type__Server_Reponse__Player__Get } from '../../types/Type__Server_Response/Type__Server_Response__Player__GET'





export default function Game() {

	const navigate = useNavigate()
	const { t } = useTranslation()
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
				alert(t('error.session_not_found'))
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
				alert(t('error.session_not_found'))
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
				alert(t('error.resource_not_found'))
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

		if(!surrender_winner && list__table_columns.some(table_column => table_column.List__Table_Columns.some(tc => !tc.Bottom_Table_TotalScore))) return alert(t('please_enter_all_values'))	
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
				handle_409: () => alert(t('please_enter_all_values'))
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
						text={t('finish_game')}
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
			setShow_popup={setShow_surrender}
			show_popup={show_surrender}
			title={t('select_winner')}
		>
			<div className='game_popup-surrender'>

				{surrender_winner ? <>

					<div className='askifsurrender'>

						<h2>{t('sure_that_this_player_is_the_winner', { name: surrender_winner.Name })}</h2>

						<CustomButton
							loading={loading_finish_game}
							onClick={finish_game}
							text={t('yes')}
						/>

						<button 
							className='button button_reverse_red' 
							onClick={() => setSurrender_winner(undefined)}
						>{t('cancel')}</button>
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
