

import '../App.css'

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { formatDate } from '../logic/utils'
import { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'





function SessionAnalytics() {

	
	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const location = useLocation()
	const sessionid = new URLSearchParams(location.search).get('sessionid')

	const [session, setSession] = useState()
	const [finalScores, setFinalScores] = useState()

	const [list, setList] = useState([])
	const [wins, setWins] = useState([])
	const [availableYears, setAvailableYears] = useState([])
	const [showFinalScores, setShowFinalScores] = useState()

	const firstColumnWidth = '150px'
	const firstColumnStyle = { width: firstColumnWidth, minWidth: firstColumnWidth, maxWidth: firstColumnWidth, padding: '5px', fontWeight: 'bold' }
	const columnWidth = session?.List_Players?.length > 8 ? '75px' : (session?.List_Players?.length > 4 ? '125px' : '200px')
	const style = { width: columnWidth, minWidth: columnWidth, maxWidth: columnWidth, padding: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }




	useEffect(() => {

		// if(!session || !session.List_Players) return navigate('/creategame', { replace: true })



	}, [])

	const continueToGame = () => {

		navigate('/game', { replace: true })

	}


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
									value={showFinalScores}
									onChange={(e) => setShowFinalScores(e.target.value)}
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
							{wins.map((w, i) => (
								<td key={i} style={style}>
									{w}
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
									<td key={`${i}.${j}`} style={style}>{fs[p.Alias]}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<button className='button' style={{ height: '40px', width: '100%', marginBottom: '0px' }} onClick={continueToGame}>Los geht's!</button>

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<p className='link-switch'>
					<Link to={`/sessionpreview?sessionid=${sessionid}`} onClick={''}>Zurück</Link>
				</p>
			</div>
		
		</>
	)

}

export default SessionAnalytics
