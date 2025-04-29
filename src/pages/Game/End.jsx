

import './scss/End.scss'

import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import Loader from '../../components/Loader/Loader'
import OptionsDialog from '../../components/Popup/Popup_Options'

import { get__user } from '../../api/user'
import { get__final_score } from '../../api/final_score'
import { get__session_players } from '../../api/session/session_players'





export default function EndScreen() {

	const axiosPrivate = useAxiosPrivate()

	const [ header, setHeader ] = useState('')

	const location = useLocation()
	const urlParams = new URLSearchParams(location.search)
	const session_id = +urlParams.get('session_id')
	const finalscore_id = +urlParams.get('finalscore_id')





	// __________________________________________________ Queries __________________________________________________ // TODO implement error handling

	// ____________________ User ____________________

	const { data: user, isLoading: isLoading__user, isError: isError__user } = useQuery({
		queryKey: [ 'user' ], 
		queryFn: () => get__user(axiosPrivate), 
	})


	// ____________________ List_Players ____________________

	const { data: list_players, isLoading: isLoading__list_players, isError: isError__list_players } = useQuery({
		enable: Boolean(session_id), 
		queryKey: [ 'session', session_id, 'players' ], 
		queryFn: () => get__session_players(axiosPrivate, session_id), 
	})


	// ____________________ FinalScore ____________________

	const { data: final_score, isLoading: isLoading__final_score, isError: isError__final_score } = useQuery({
		enable: Boolean(session_id), 
		queryKey: [ 'session', session_id, 'finalscore', finalscore_id ], 
		queryFn: () => get__final_score(axiosPrivate, session_id, finalscore_id), 
	})





	useEffect(() => {

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
		if(list_winner.length === 1) {
			setHeader(`'${list_winner[0]}' hat gewonnen!`)
		} else {
			let string = `'${list_winner[0]}' `
			for(let i = 1; list_winner.length > i; i++) {
				const p = `'${list_winner[i]}'`
				if((i + 1) === list_winner.length) {
					string += ` und ${p} haben gewonnen!`
				} else {
					string += `, ${p}`
				}
			}
			setHeader(string)
		}

		// eslint-disable-next-line
	}, [ list_players, final_score ])





	return <>

		<OptionsDialog user={user}/>

		



		<div className='end_container'>

			<h1>{header}</h1>



			<div className='table_container'>
				<table className='table'>
					<tbody>

						<tr>
							<td>Spieler</td>
							{list_players?.map(player => (
								<td key={player.id}><span>{player.Name}</span></td>
							))}
						</tr>

						<tr>
							<td>Gewonnen</td>
							{list_players?.map(player => (
								<td key={player.id}><span>{final_score?.Wins__After[player.id]}</span></td>
							))}
						</tr>

						<tr>
							<td>Punkte</td>
							{list_players?.map(player => (
								<td key={player.id}><span>{final_score?.PlayerScores[player.id]}</span></td>
							))}
						</tr>

					</tbody>
				</table>
			</div>



			<Loader loading={isLoading__user || isLoading__list_players || isLoading__final_score}/>



			<a 
				href='/#/'
				className='button' 
			>Ok</a>

		</div>
		
	</>
}
