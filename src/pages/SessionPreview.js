

import '../App.css'

import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { formatDate } from '../logic/utils'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Loader from '../components/Loader'


function SessionPreview() {
	
	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const location = useLocation()
	const sessionid = new URLSearchParams(location.search).get('sessionid')
	const [ session, setSession ] = useState()

	const [ list, setList ] = useState([])
	const [ wins, setWins ] = useState([])
	const [ finalScores, setFinalScores ] = useState([])
	const [ loaderVisible, setLoaderVisible ] = useState(false)
	const [ showLastFinalScores, setShowLastFinalScores ] = useState()

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
					params: { id: sessionid },
					withCredentials: true
				}
			).then((res) => {
				
				setSession(res.data.Session)
				const l = res.data.FinalScores
				l.sort(sortByTimestampDesc)
				setFinalScores(l)
				setShowLastFinalScores('thisYear')

			}).catch((err) => {

				const status = err?.response?.status
				if(status === 404) {
					window.alert('Die SessionID exisiert nicht!')
				} else if(status === 400) {
					window.alert('Die Anfrage ist falsch!')
				} else {
					console.log(err)
					window.alert('Beim Server trat ein Fehler auf!')
				}
				navigate('/selectsession', { replace: true })

			})

			setLoaderVisible(false)

		}

		request()

	}, [])

	const sortByTimestampDesc = (a, b) => {
		return new Date(b.End) - new Date(a.End)
	}





	useEffect(() => {

		if(showLastFinalScores === 'all') {
			
			const allWins = {}
			session?.List_PlayerOrder?.map((alias) => {
				const player = getPlayer(alias)
				return allWins[player.Alias] = player.Wins
			})
			setWins(allWins)
			return setList(finalScores)

		}

		const tmp = []
		const tmp_wins = {}
		session?.List_PlayerOrder?.map((alias) => {
			const player = getPlayer(alias)
			return tmp_wins[player.Alias] = 0
		})

		const today = new Date()
		const d = today.getDate()
		const m = today.getMonth()
		const y = today.getFullYear()

		for( const f of finalScores) {
			
			const date = new Date(f.End)
			if(date.getFullYear() === y) {
				if(showLastFinalScores === 'thisMonth' && date.getMonth() !== m) continue
				if(showLastFinalScores === 'thisDay' && ( date.getMonth() !== m || date.getDate() !== d ) ) continue
				
				for(const w of f.List_Winner) {
					tmp_wins[w]++
				}
				
				tmp.push(f)
			}

		}

		setWins(tmp_wins)
		setList(tmp)

	}, [showLastFinalScores])

	const getPlayer = (alias) => {

		for(const p of session?.List_Players) {
			if(p.Alias === alias) {
				return p
			}
		}

	}

	const play = () => {

		axiosPrivate.post('/sessionpreview',
			{ SessionID: sessionid },
			{
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		).then((res) => {

			navigate(`/game?sessionid=${sessionid}&joincode=${res?.data?.JoinCode}`, { replace: true })

		}).catch((err) => {

			const status = err?.response?.status
			if(status === 400) {
				window.alert('Fehlerhafte Anfrage!\nIrgendwas stimmt mit der SessionID nicht.')
			} else if(status === 404) {
				window.alert('Die Session existiert nicht!')
			} else {
				console.log(err)
				window.alert('Es trat ein unvorhergesehener Fehler auf!')
			}
			navigate('/selectsession', { replace: true })
			
		})

	}







	return (
		<>

			<div style={{ overflow: 'hidden', scrollbarGutter: 'stable both-edges' }}>
				<table className='table'>
					<tbody>
						<tr>
							<td style={firstColumnStyle}>Spieler</td>
							{session?.List_PlayerOrder?.map((alias, i) => {
								const player = getPlayer(alias)
								return (<td key={i} style={style}>{player.Name}</td>)
							})}
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
							{session?.List_PlayerOrder?.map((alias, i) => {
								const player = getPlayer(alias)
								return (<td key={i} style={style}>{wins[player.Alias]}</td>)
							})}
						</tr>
					</tbody>
				</table>
			</div>

			<div style={{ maxHeight: '305px', overflowY: 'auto', overflowX: 'hidden', scrollbarGutter: 'stable both-edges' }}>
				<table className='table'>
					<tbody>
						{list?.map((fs, i) => (
							<tr key={i}>
								<td style={firstColumnStyle}>{formatDate(fs.End)}</td>
								{session?.List_PlayerOrder?.map((alias, j) => {
									const player = getPlayer(alias)
									return (<td key={`${i}.${j}`} style={style}>{fs.PlayerScores[player.Alias]}</td>)
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			
			<Loader loaderVisible={loaderVisible}/>
				
			<button className='button' style={{ height: '50px', width: '100%', marginBottom: '0px' }} onClick={play}>Los geht's!</button>

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<p className='link-switch'>
					<Link to='/selectsession'>Zurück</Link>
				</p>
				<p className='link-switch'>
					<Link to={`/sessionanalytics?sessionid=${sessionid}`}>Mehr {'>'}</Link>
				</p>
			</div>

		</>
	)
}

export default SessionPreview
