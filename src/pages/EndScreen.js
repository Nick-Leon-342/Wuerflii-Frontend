

import './css/EndScreen.css'

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

import Loader from '../components/Loader'
import OptionsDialog from '../components/Dialog/OptionsDialog'





export default function EndScreen() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const [ list_players, setList_players ] = useState([])
	const [ finalscore, setFinalScore ] = useState()

	const [header, setHeader] = useState('')
	const [loaderVisible, setLoaderVisible] = useState(false)

	const location = useLocation()
	const urlParams = new URLSearchParams(location.search)
	
	





	useEffect(() => {

		setLoaderVisible(true)

		const session_id = +urlParams.get('session_id')
		const finalscore_id = +urlParams.get('finalscore_id')

		if(!session_id || !finalscore_id) return navigate('/selectsession', { replace: true })

		axiosPrivate.get(`/endscreen?session_id=${session_id}&finalscore_id=${finalscore_id}`).then(({ data }) => {


			const finalscore = data.FinalScore
			const list_players = data.List_Players
			
			setFinalScore(finalscore)
			setList_players(list_players)


			// Init list_winner
			const list_winner = []
			for(const winnerAlias of finalscore.List_Winner) {
				for(const p of list_players) {
					if(winnerAlias === p.Alias) {
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
			
			const status = err?.response?.status
			if(status === 400) {
				window.alert('Irgendwas stimmt nicht mit der Serverabfrage!')
			} else if (status === 404) {
				window.alert('Die Session wurde nicht gefunden!')
			} else {
				window.alert('Es trat ein unvorhergesehener Fehler auf!')
			}
			// navigate('/selectsession', { replace: true })
			
		}).finally(() => {setLoaderVisible(false)})

	}, [])





	return (
		<>

			<OptionsDialog/>
		
			<h1>{header}</h1>



			<table className='table wins'>
				<tbody>

					<tr>
						<td>Spieler</td>
						{list_players.map((p, i) => (
							<td key={i}>{p.Name}</td>
						))}
					</tr>

					<tr>
						<td>Gewonnen</td>
						{list_players.map((p, i) => (
							<td key={i}>{finalscore?.ScoresAfter[p.Alias]}</td>
						))}
					</tr>

					<tr>
						<td>Punkte</td>
						{list_players.map((p, i) => (
							<td key={i}>{finalscore?.PlayerScores[p.Alias]}</td>
						))}
					</tr>

				</tbody>
			</table>

			<Loader loaderVisible={loaderVisible}/>



			<button 
				className='button button-thick' 
				onClick={() => navigate('/selectsession', { replace: false })}
			>Ok</button>

		</>
	)
}
