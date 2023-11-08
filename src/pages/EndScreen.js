

import '../App.css'
import './css/EndScreen.css'

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

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





	useEffect(() => {

		setLoaderVisible(true)

		async function connect() {
			await axiosPrivate.get('/endscreen',
				{
					headers: { 'Content-Type': 'application/json' },
					params: { id: sessionId },
					withCredentials: true
				}
			).then((res) => {

				setSession(res?.data)
				if(!winner || !res?.data) return navigate('/creategame', { replace: true })

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

			}).catch(() => {
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
				</tbody>
			</table>

			<Loader loaderVisible={loaderVisible}/>

			<button className='button' style={{ width: '100%' }} onClick={() => navigate('/creategame', { replace: false })}>Ok</button>

		</>
	)
}

export default EndScreen
