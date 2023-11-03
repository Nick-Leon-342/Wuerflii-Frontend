

import '../App.css'

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearSessionStorage, sessionStorage_session, sessionStorage_finalscores, formatDate } from './utils'
import useAxiosPrivate from '../hooks/useAxiosPrivate'


function SessionPreview() {
	
	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const session = JSON.parse(sessionStorage.getItem(sessionStorage_session)) || navigate('/creategame', { replace: true })

	const [list, setList] = useState([])
	const [wins, setWins] = useState([])
	const [finalScores, setFinalScores] = useState([])
	const [loaderVisible, setLoaderVisible] = useState(false)
	const [showLastFinalScores, setShowLastFinalScores] = useState()

	const firstColumnWidth = '150px'
	const firstColumnStyle = { width: firstColumnWidth, minWidth: firstColumnWidth, maxWidth: firstColumnWidth, padding: '5px', fontWeight: 'bold' }
	const columnWidth = session?.List_Players?.length > 8 ? '75px' : (session?.List_Players?.length > 4 ? '125px' : '200px')
	const style = { width: columnWidth, minWidth: columnWidth, maxWidth: columnWidth, padding: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }

	

	

	useEffect(() => {

		async function request() {

			setLoaderVisible(true)

			await axiosPrivate.get('/sessionpreview',
				{
					headers: { 'Content-Type': 'application/json' },
					params: { id: session.id },
					withCredentials: true
				}
			).then((res) => {
				setFinalScores(res.data.slice().reverse())
				setShowLastFinalScores('thisYear')
			}).catch((err) => {
				const status = err?.response?.status
				if(status === 404) {
					navigate('/selectsession', { replace: true })
				} else {
					window.alert('Unknown error:', err)
				}
			})

			setLoaderVisible(false)

		}

		request()

	}, [])
	




	const back = () => {
	
		clearSessionStorage()
		navigate('/selectsession', { replace: true })
	
	}





	const showAnalytics = () => {

		sessionStorage.setItem(sessionStorage_finalscores, JSON.stringify(finalScores))

	}

	useEffect(() => {

		sessionStorage.removeItem(sessionStorage_finalscores)

		if(showLastFinalScores === 'all') {
			
			const allWins = {}
			session?.List_Players?.map((p) => (allWins[p.Alias] = p.Wins))
			setWins(allWins)
			return setList(finalScores)

		}

		const tmp = []
		const tmp_wins = {}
		session?.List_Players?.map((p) => (
			tmp_wins[p.Alias] = 0
		))

		const today = new Date()
		const d = today.getDay()
		const m = today.getMonth()
		const y = today.getFullYear()

		for( const f of finalScores) {
			
			const date = new Date(f.Played)
			if(date.getFullYear() === y) {
				if(showLastFinalScores === 'thisMonth' && date.getMonth() !== m) continue
				if(showLastFinalScores === 'thisDay' && ( date.getMonth() !== m || date.getDay() !== d ) ) continue
				
				for(const w of f.List_Winner) {
					tmp_wins[w]++
				}
				
				tmp.push(f)
			}

		}

		setWins(tmp_wins)
		setList(tmp)

	}, [showLastFinalScores])





	return (
		<>

			<div style={{ overflow: 'hidden', scrollbarGutter: 'stable both-edges' }}>
				<table className='table'>
					<tbody>
						<tr>
							<td style={firstColumnStyle}>Spieler</td>
							{session?.List_Players?.map((p, i) => (
								<td key={i} style={style}>{p.Name}</td>
							))}
						</tr>
						<tr>
							<td style={{ width: firstColumnWidth, minWidth: firstColumnWidth, maxWidth: firstColumnWidth, padding: '5px', fontWeight: 'bold' }}>
								Gewonnen<br/>
								<select 
									value={showLastFinalScores}
									onChange={(e) => setShowLastFinalScores(e.target.value)}
									style={{ 
										color: 'var(--text-color)', 
										border: 'none', 
										outline: 'none',
										background: 'none',
									}}>
									<option value='all'>Gesamt</option>
									<option value='thisYear'>Dieses Jahr</option>
									<option value='thisMonth'>Dieser Monat</option>
									<option value='thisDay'>Dieser Tag</option>
								</select>
							</td>
							{session?.List_Players?.map((p, i) => (
								<td key={i} style={style}>
									{wins[p.Alias]}
								</td>
							))}
						</tr>
					</tbody>
				</table>
			</div>

			<div style={{ maxHeight: '305px', overflowY: 'auto', overflowX: 'hidden', scrollbarGutter: 'stable both-edges' }}>
				<table className='table'>
					<tbody>
						{list?.map((fs, i) => (
							<tr key={i}>
								<td style={firstColumnStyle}>{formatDate(fs.Played)}</td>
								{session?.List_Players?.map((p, j) => (
									<td key={`${i}.${j}`} style={style}>{fs.PlayerScores[p.Alias]}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			
			<div className={`loader ${loaderVisible ? '' : 'notVisible'}`}>
				<span/>
				<span/>
				<span/>
			</div>
				
			<button className='button' style={{ height: '40px', width: '100%', marginBottom: '0px' }} onClick={() => navigate('/game', { replace: true })}>Los geht's!</button>

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<p className='link-switch'>
					<Link to='/selectsession' onClick={back}>Zurück</Link>
				</p>
				<p className='link-switch'>
					<Link to='/sessionanalytics' onClick={showAnalytics}>Mehr {'>'}</Link>
				</p>
			</div>

		</>
	)
}

export default SessionPreview
