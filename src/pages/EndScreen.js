

import '../App.css'
import './css/EndScreen.css'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sessionStorage_players, sessionStorage_winner, clearSessionStorage } from './utils'
import useAxiosPrivate from '../hooks/useAxiosPrivate'





function EndScreen() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const players = JSON.parse(sessionStorage.getItem(sessionStorage_players))
	const winner = JSON.parse(sessionStorage.getItem(sessionStorage_winner))

	const [header, setHeader] = useState('')





	useEffect(() => {

		async function connect() {
			await axiosPrivate.get('/endscreen',
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			).catch(() => {
				navigate('/login', { replace: true })
			})
		}

		connect()

		if(!players || !winner) return navigate('/creategame', { replace: true })

		if(winner.length === 1) {
			setHeader(`'${players[winner[0]].Name}' hat gewonnen!`)
		} else {
			let string = `'${players[winner[0]].Name}' `
			for(let i = 1; winner.length > i; i++) {
				const p = `'${players[winner[i]].Name}'`
				if((i + 1) === winner.length) {
					string += ` und ${p} haben gewonnen!`
				} else {
					string += `, ${p}`
				}
			}
			setHeader(string)
		}

	}, [])





	const ok = () => {
		
		clearSessionStorage()
		navigate('/creategame', { replace: true })
	
	}





	return (
		<>
		
			<div className='button-container'><label className='winner'>
				{header}
			</label></div>

			<br/>

			<table className='table wins'>
				<tbody>
					<tr>
						<td>Spieler</td>
						{players?.map((p, i) => (
							<td key={i}>{p.Name}</td>
						))}
					</tr>
					<tr>
						<td>Gewonnen</td>
						{players?.map((p, i) => (
							<td key={i}>{p.Wins}</td>
						))}
					</tr>
				</tbody>
			</table>

			<button className='button' style={{ width: '100%' }} onClick={ok}>Ok</button>

		</>
	)
}

export default EndScreen
