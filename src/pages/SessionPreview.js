


import './css/SessionPreview.css'


import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { formatDate } from '../logic/utils'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Loader from '../components/Loader'
import OptionsDialog from '../components/Dialog/OptionsDialog'


function SessionPreview() {
	
	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const location = useLocation()
	const sessionid = new URLSearchParams(location.search).get('sessionid')
	const [ session, setSession ] = useState()

	const [ list, setList ] = useState([])
	const [ wins, setWins ] = useState([])
	const [ finalScores, setList_FinalScores ] = useState([])
	const [ loaderVisible, setLoaderVisible ] = useState(false)

	const [ view, setView ] = useState()
	const [ year, setYear ] = useState()
	const [ list_year, setList_year ] = useState([])
	const [ month, setMonth ] = useState()
	const list_month = [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ]

	const firstColumnWidth = '150px'
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
			).then(({ data }) => {

				const tmp_session = data.Session

				//Order players
				const tmpList_Players = []
				for(const alias of tmp_session.List_PlayerOrder) {
					for(const p of tmp_session.List_Players) {
						if(alias === p.Alias) {
							tmpList_Players.push(p)
							break
						}
					}
				}
				tmp_session.ListPlayers = tmpList_Players


				setSession(tmp_session)

				const l = data.FinalScores
				l.sort((a, b) => new Date(b.End) - new Date(a.End))
				setList_FinalScores(l)

				const tmp_list_years = []
				for(const e of l) {
					const y = new Date(e.End).getFullYear()
					if(!tmp_list_years.includes(y)) tmp_list_years.push(y)
				}
				setMonth(new Date().getMonth())
				setYear(tmp_list_years[tmp_list_years.length - 1])
				setList_year(tmp_list_years.slice().sort((a, b) => a - b))
				setView('showYear')



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

	const editList = ( list_toEdit, setList_toEdit ) => {

		if(!list_toEdit || list_toEdit.length === 0) return

		const list = []

		const first = new Date(list_toEdit[0].End)
		list.push({ Group_Date: first })
		let currentDate = first
	
		list_toEdit.forEach(e => {
			const d = new Date(e.End)
			if(d.toDateString() !== currentDate.toDateString()) {
				list.push({ Group_Date: d })
				currentDate = d
			}
			list.push(e)
		})
		
		setList_toEdit(list)

	}





	useEffect(() => {

		if(!session) return

		if(view === 'all') {
			
			const allWins = {}
			session.List_Players.map(p => {
				return allWins[p.Alias] = p.Wins
			})
			setWins(allWins)
			return editList(finalScores, setList)

		}

		const tmp = []
		const tmp_wins = {}
		session.List_Players.map(p => 
			 tmp_wins[p.Alias] = 0
		)

		for( const f of finalScores) {
			
			const date = new Date(f.End)
			if(date.getFullYear() === +year) {
				if(view === 'showMonth' && date.getMonth() !== +month) continue
				
				for(const w of f.List_Winner) {
					tmp_wins[w]++
				}
				
				tmp.push(f)
			}

		}

		setWins(tmp_wins)
		editList(tmp, setList)

	}, [view, year, month])

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

	const handleClick = (finalScore) => {

		navigate(`/sessionpreview/table?sessionid=${sessionid}&finalscoreid=${finalScore.id}`, { replace: false })

	}

	const css = () => {

		return { 
			width: '150px', 
			fontSize: '15px', 
			borderRadius: '10px',
			height: '30px',
			padding: '5px',
			marginLeft: '5px',
			marginRight: '10px',
			marginTop: '0',
			marginBottom: '10px',
			backgroundColor: 'var(--background-color)', 
			border: '1px solid var(--text-color)',
			outline: 'none',
			color: 'var(--text-color)',
			boxShadow: 'none',
		}

	}

	useEffect(() => {

		console.log(list)

	}, [list])







	return (
		<>

			<OptionsDialog/>
			
			<div style={{ display: 'flex', justifyContent: 'space-around' }}>

				<select 
					value={view}
					onChange={(e) => setView(e.target.value)}
					style={css()}>
					<option key={0} value='all'>Gesamtansicht</option>
					<option key={1} value='showYear'>Jahresansicht</option>
					<option key={2} value='showMonth'>Monatsansicht</option>
				</select>

				{view !== 'all' && <select 
					value={year}
					onChange={(e) => setYear(e.target.value)}
					style={css()}>
					{list_year.map((y, i) => 
						<option key={i} value={y}>{y}</option>
					)}
				</select>}
				
				{view === 'showMonth' && <select 
					value={month}
					onChange={(e) => setMonth(e.target.value)}
					style={css()}>
					{list_month.map((m, i) => 
						<option key={i} value={i}>{m}</option>
					)}
				</select>}

			</div>

			<div style={{ overflow: 'hidden', scrollbarGutter: 'stable both-edges' }}>
				<table className='table'>
					<tbody>
						<tr>
							{session?.List_PlayerOrder?.map((alias, i) => {
								const player = getPlayer(alias)
								return (<td key={i} style={style}>{player.Name}</td>)
							})}
						</tr>
						<tr>
							{session?.List_PlayerOrder?.map((alias, i) => {
								const player = getPlayer(alias)
								return (<td key={i} style={style}>{wins[player.Alias]}</td>)
							})}
						</tr>
					</tbody>
				</table>
			</div>

			<div style={{ maxHeight: '305px', overflowY: 'auto', overflowX: 'hidden', scrollbarGutter: 'stable both-edges' }}>
				<table className='table sessionpreview_table'>
					<tbody>
						{list?.map((fs, i) => {
							if(fs.Group_Date) {

								return <tr className='date-row'>
									<td><label className='date'>{formatDate(fs.Group_Date)}</label></td>
								</tr>

							} else {

								return (
									<tr key={i} className='listElement' style={{ display: 'block' }} onClick={() => handleClick(fs)}>
										{session?.List_PlayerOrder?.map((alias, j) => {
											const player = getPlayer(alias)
											return (<td key={`${i}.${j}`} style={style}>{fs.PlayerScores[player.Alias]}</td>)
										})}
									</tr>
								)

							}
						})}
					</tbody>
				</table>
			</div>
			
			<Loader loaderVisible={loaderVisible}/>
			
			<button className='button' style={{ height: '50px', width: '100%', marginBottom: '0px' }} onClick={play}>Los geht's!</button>

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<p className='link-switch'>
					<Link to='/selectsession'>Zurück</Link>
				</p>
			</div>

		</>
	)
}

export default SessionPreview
