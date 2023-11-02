

import '../App.css'
import './css/EndScreen.css'

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sessionStorage_session, sessionStorage_winner, clearSessionStorage } from './utils'
import useAxiosPrivate from '../hooks/useAxiosPrivate'





function EndScreen() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const session = JSON.parse(sessionStorage.getItem(sessionStorage_session))
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

		if(!session || !winner) return navigate('/creategame', { replace: true })

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
				</tbody>
			</table>

			<button className='button' style={{ width: '100%' }} onClick={ok}>Ok</button>

		</>
	)
}

export default EndScreen
