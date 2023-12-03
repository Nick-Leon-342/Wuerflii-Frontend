

import '../App.css'
import './css/EndScreen.css'

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { getPlayer } from '../logic/utils'

import Loader from '../components/Loader'





function EndScreen() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const [session, setSession] = useState()
	const [header, setHeader] = useState('')
	const [loaderVisible, setLoaderVisible] = useState(false)

	const location = useLocation()
	const urlParams = new URLSearchParams(location.search)
	const winner = JSON.parse(urlParams.get('winner'))
	const sessionId = +urlParams.get('sessionid')
	const playerScores = JSON.parse(urlParams.get('playerscores'))





	useEffect(() => {

		setLoaderVisible(true)

		async function connect() {
			await axiosPrivate.get('/endscreen',
				{
					headers: { 'Content-Type': 'application/json' },
					params: { SessionID: sessionId },
					withCredentials: true
				}
			).then((res) => {

				const tmp_session = res.data
				if(!winner || !tmp_session) return navigate('/creategame', { replace: true })

				const tmp_listPlayers = []
				for(const alias of tmp_session.List_PlayerOrder) {
					tmp_listPlayers.push(getPlayer(alias, tmp_session))
				}
				tmp_session.List_Players = tmp_listPlayers

				setSession(tmp_session)

				if(winner.length === 1) {
					setHeader(`'${winner[0]}' hat gewonnen!`)
				} else {
					let string = `'${winner[0]}' `
					for(let i = 1; winner.length > i; i++) {
						const p = `'${winner[i]}'`
						if((i + 1) === winner.length) {
							string += ` und ${p} haben gewonnen!`
						} else {
							string += `, ${p}`
						}
					}
					setHeader(string)
				}

				setLoaderVisible(false)

			}).catch((err) => {
				
				const status = err?.response?.status
				if(status === 400) {
					window.alert('Irgendwas stimmt nicht mit der Serverabfrage!')
				} else if (status === 404) {
					window.alert('Die Session wurde nicht gefunden!')
				} else {
					window.alert('Es trat ein unvorhergesehener Fehler auf!')
				}
				navigate('/creategame', { replace: true })
				
			})
		}

		connect()

	}, [])





	return (
		<>
		
			<div className='button-container'>
				<label className='winner'>
					{header}
				</label>
			</div>

			<br/>

			<table className='table wins'>
				<tbody>
					<tr>
						<td>Spieler</td>
						{session?.List_Players.map((p, i) => (
							<td key={i}>{p.Name}</td>
						))}
					</tr>
					<tr>
						<td>Gewonnen</td>
						{session?.List_Players.map((p, i) => (
							<td key={i}>{p.Wins}</td>
						))}
					</tr>
					<tr>
						<td>Punkte</td>
						{session?.List_Players.map((p, i) => (
							<td key={i}>{playerScores[p.Alias]}</td>
						))}
					</tr>
				</tbody>
			</table>

			<Loader loaderVisible={loaderVisible}/>

			<button className='button' style={{ width: '100%', height: '60px' }} onClick={() => navigate('/creategame', { replace: false })}>Ok</button>

		</>
	)
}

export default EndScreen
