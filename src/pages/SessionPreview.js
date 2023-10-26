

import '../App.css'

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearSessionStorage, resizeEvent, sessionStorage_session, formatDate } from './utils'
import useAxiosPrivate from '../hooks/useAxiosPrivate'


function SessionPreview() {
	
	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const session = JSON.parse(sessionStorage.getItem(sessionStorage_session))
	const [finalScores, setFinalScores] = useState()

	

	

	useEffect(() => {
		
		if(!session || !session.List_Players) return navigate('/creategame', { replace: true })

		axiosPrivate.get('/sessionpreview',
			{
				headers: { 'Content-Type': 'application/json' },
				params: { id: session.id },
				withCredentials: true
			}
		).then((res) => {
			setFinalScores(JSON.parse(res.data))
		}).catch((err) => {
			const status = err.response.status
			if(status === 404) {
				window.alert('Die Partie wurde nicht gefunden!')
				navigate('/selectsession', { replace: true })
			} else {
				window.alert('Unknown error:', err)
			}
		})

		resizeEvent()

	}, [])
	
	const back = () => {
	
		clearSessionStorage()
		navigate('/selectsession', { replace: true })
	
	}

	const firstColumnWidth = '150px'
	const firstColumnStyle = { width: firstColumnWidth, minWidth: firstColumnWidth, maxWidth: firstColumnWidth, padding: '5px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
	const columnWidth = session?.List_Players?.length > 8 ? '75px' : (session?.List_Players?.length > 4 ? '125px' : '200px')
	const style = { width: columnWidth, minWidth: columnWidth, maxWidth: columnWidth, padding: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }




	return (
		<>
			<table className='table'>
				<tbody>
					<tr>
						<td style={firstColumnStyle}>Spieler</td>
						{session?.List_Players?.map((p, i) => (
							<td key={i} style={style}>{p.Name}</td>
						))}
					</tr>
					<tr>
						<td style={firstColumnStyle}>Gewonnen</td>
						{session?.List_Players?.map((p, i) => (
							<td key={i} style={style}>{p.Wins}</td>
						))}
					</tr>
				</tbody>
			</table>

			<table className='table'>
				<tbody>
					{finalScores && finalScores.map((fs, i) => (
						<tr key={i}>
							<td style={firstColumnStyle}>{formatDate(fs.Played)}</td>
							{session?.List_Players?.map((p, j) => (
								<td key={`${i}.${j}`} style={style}>{fs[p.Alias]}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
				
			<button className='button' style={{ width: '100%', marginBottom: '0px' }} onClick={() => navigate('/game', { replace: true })}>Los geht's!</button>
			<div style={{ display: 'flex' }}>
				<p className='link-switch'>
					<Link to='/selectsession' onClick={back}>Zurück</Link>
				</p>
			</div>
		</>
	)
}

export default SessionPreview
