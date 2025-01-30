

import './scss/End.scss'

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import Loader from '../../components/Loader/Loader'
import useErrorHandling from '../../hooks/useErrorHandling'
import OptionsDialog from '../../components/Popup/Popup_Options'





export default function EndScreen() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ user, setUser ] = useState()
	const [ list_players, setList_players ] = useState([])
	const [ finalscore, setFinalScore ] = useState()

	const [ header, setHeader ] = useState('')
	const [ loading, setLoading ] = useState(false)

	const location = useLocation()
	const urlParams = new URLSearchParams(location.search)





	useEffect(() => {

		
		const session_id = +urlParams.get('session_id')
		const finalscore_id = +urlParams.get('finalscore_id')
		
		if(!session_id || !finalscore_id) return navigate('/', { replace: true })
		setLoading(true)

		axiosPrivate.get(`/game/end?session_id=${session_id}&finalscore_id=${finalscore_id}`).then(({ data }) => {


			const finalscore = data.FinalScore
			const list_players = data.List_Players
			
			setUser(data.User)
			setFinalScore(finalscore)
			setList_players(list_players)


			// Init list_winner
			const list_winner = []
			for(const winner_id of finalscore.List_Winner) {
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


		}).catch((err) => {
			
			handle_error({
				err, 
				handle_404: () => navigate('/', { replace: true })
			})
			
		}).finally(() => setLoading(false))

		// eslint-disable-next-line
	}, [])





	return <>

		<OptionsDialog
			user={user}
			setUser={setUser}
		/>

		



		<div className='end_container'>

			<h1>{header}</h1>



			<div className='table_container'>
				<table className='table'>
					<tbody>

						<tr>
							<td>Spieler</td>
							{list_players.map((p, i) => (
								<td key={i}><span>{p.Name}</span></td>
							))}
						</tr>

						<tr>
							<td>Gewonnen</td>
							{list_players.map((p, i) => (
								<td key={i}><span>{finalscore?.Wins__After[p.id]}</span></td>
							))}
						</tr>

						<tr>
							<td>Punkte</td>
							{list_players.map((p, i) => (
								<td key={i}><span>{finalscore?.PlayerScores[p.id]}</span></td>
							))}
						</tr>

					</tbody>
				</table>
			</div>



			<Loader loading={loading}/>



			<button 
				className='button' 
				onClick={() => navigate('/', { replace: false })}
			>Ok</button>

		</div>
		
	</>
}
