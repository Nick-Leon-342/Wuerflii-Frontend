

import './scss/End.scss'

import { useContext, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import OptionsDialog from '../../components/Popup/Popup__Options'

import { get__user } from '../../api/user'
import { get__final_score } from '../../api/final_score'
import { get__session_players } from '../../api/session/session_players'
import Context__Universal_Loader from '../../Provider_And_Context/Provider_And_Context__Universal_Loader'
import { useTranslation } from 'react-i18next'





export default function EndScreen() {

	const navigate = useNavigate()
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { setLoading__universal_loader } = useContext(Context__Universal_Loader)

	const [ header, setHeader ] = useState('')

	const location = useLocation()
	const urlParams = new URLSearchParams(location.search)
	const session_id = +(urlParams.get('session_id') || -1)
	const finalscore_id = +(urlParams.get('finalscore_id') || -1)





	// __________________________________________________ Queries __________________________________________________ 

	// ____________________ User ____________________

	const { data: user, isLoading: isLoading__user, error: error__user } = useQuery({
		queryFn: () => get__user(axiosPrivate), 
		queryKey: [ 'user' ], 
	})

	if(error__user) {
		handle_error({
			err: error__user, 
		})
	}


	// ____________________ List__Players ____________________

	const { data: list_players, isLoading: isLoading__list_players, error: error__list_players } = useQuery({
		queryKey: [ 'session', session_id, 'players' ], 
		queryFn: () => get__session_players(axiosPrivate, session_id), 
	})

	if(error__list_players) {
		handle_error({
			err: error__list_players, 
			handle_404: () => {
				alert(t('session_not_found'))
				navigate('/', { replace: true })
			}
		})
	}


	// ____________________ FinalScore ____________________

	const { data: final_score, isLoading: isLoading__final_score, error: error__final_score } = useQuery({
		queryKey: [ 'session', session_id, 'finalscore', finalscore_id ], 
		queryFn: () => get__final_score(axiosPrivate, session_id, finalscore_id), 
	})

	if(error__final_score) {
		handle_error({
			err: error__final_score, 
			handle_404: () => {
				alert(t('session_not_found'))
				navigate('/', { replace: true })
			}
		})
	}





	useEffect(() => {
		function init() {
			if(!final_score || !list_players) return
	
			// Init list_winner
			const list_winner = []
			for(const winner_id of final_score.List_Winner) {
				for(const p of list_players) {
					if(+winner_id === p.id) {
						list_winner.push(p.Name)
					}
				}
			}
	
	
			// Init header
			if (list_winner.length === 1) {
    			setHeader(t('game_end.winner_one', { name: list_winner[0] }))
			} else {
				const lastWinner = list_winner[list_winner.length - 1]
				const otherWinners = list_winner.slice(0, -1);
				
				const namesJoined = `'${otherWinners.join("', '")}'`
				const finalNamesString = `${namesJoined}${t('game_end.list_and')}'${lastWinner}'`
				
				setHeader(t('game_end.winner_multiple', { names: finalNamesString }))
			}
		}
		init()
	}, [ list_players, final_score, t ])

	useEffect(() => { setLoading__universal_loader(isLoading__user || isLoading__list_players || isLoading__final_score) }, [ isLoading__user, isLoading__list_players, isLoading__final_score, setLoading__universal_loader ])





	return <>

		<OptionsDialog user={user}/>

		



		<div className='end_container'>

			<h1>{header}</h1>



			<div className='table_container'>
				<table className='table'>
					<tbody>

						<tr>
							<td>{t('player')}</td>
							{list_players?.map(player => (
								<td key={player.id}><span>{player.Name}</span></td>
							))}
						</tr>

						<tr>
							<td>{t('wins')}</td>
							{list_players?.map(player => (
								<td key={player.id}><span>{final_score?.Wins__After[player.id]}</span></td>
							))}
						</tr>

						<tr>
							<td>{t('game.points')}</td>
							{list_players?.map(player => (
								<td key={player.id}><span>{final_score?.PlayerScores[player.id]}</span></td>
							))}
						</tr>

					</tbody>
				</table>
			</div>



			<Link 
				to={`/session/${session_id}/preview`}
				className='button' 
			>{t('ok')}</Link>

		</div>
		
	</>
}
