


import './css/SessionPreview.css'


import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { formatDate } from '../logic/utils'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Loader from '../components/Loader'
import OptionsDialog from '../components/Dialog/OptionsDialog'
import CustomLink from '../components/NavigationElements/CustomLink'





export default function SessionPreview() {
	
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
		list.push({ Group_Date: first, ScoresAfter: list_toEdit[0].ScoresAfter })
		let currentDate = first
	
		list_toEdit.forEach(e => {
			const d = new Date(e.End)
			if(d.toDateString() !== currentDate.toDateString()) {
				list.push({ Group_Date: d, ScoresAfter: e.ScoresAfter })
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

	



	// __________________________________________________ Scroll __________________________________________________

	const [ visibleRowIndex, setVisibleRowIndex ] = useState(0)
	const div_ref = useRef(null)
	const table_ref = useRef(null)
	const listelement_ref = useRef(null)
	const [ rowHeights, setRowHeights ] = useState([])



	useEffect(() => {
		if (table_ref.current) {

			const rows = table_ref.current.querySelectorAll('tr')
			const heights = Array.from(rows).map(row => row.getBoundingClientRect().height)
			console.log('Effect', heights)
			setRowHeights(heights)

		}
	}, [table_ref])



	const handleScroll = () => {

		if (!div_ref.current || !table_ref.current) return

		const scrollTop = div_ref.current.scrollTop
		let totalHeight = 0
		let newVisibleRowIndex = 0

		for (let i = 0; i < rowHeights.length; i++) {
			totalHeight += rowHeights[i]
			if (totalHeight > scrollTop) {
				newVisibleRowIndex = i
				break
			}
		}

		setVisibleRowIndex(newVisibleRowIndex)

	}







	return (
		<>

			<OptionsDialog/>
			
			<div className='sessionpreview_select-container'>

				<select 
					value={view}
					onChange={(e) => setView(e.target.value)}>
					<option key={0} value='all'>Gesamtansicht</option>
					<option key={1} value='showYear'>Jahresansicht</option>
					<option key={2} value='showMonth'>Monatsansicht</option>
				</select>

				{view !== 'all' && <select 
					value={year}
					onChange={(e) => setYear(e.target.value)}>
					{list_year.map((y, i) => 
						<option key={i} value={y}>{y}</option>
					)}
				</select>}
				
				{view === 'showMonth' && <select 
					value={month}
					onChange={(e) => setMonth(e.target.value)}>
					{list_month.map((m, i) => 
						<option key={i} value={i}>{m}</option>
					)}
				</select>}

			</div>



			<div className='sessionpreview_table-container sessionpreview_player-table'>
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
								return (
									<td key={i} style={style}>
										{list && list.at(visibleRowIndex)?.ScoresAfter[alias]}
									</td>
								)
							})}
						</tr>
					</tbody>
				</table>
			</div>



			<div className='sessionpreview_table-container' ref={div_ref} onScroll={handleScroll}>
				<table className='table sessionpreview_table' ref={table_ref}>
					<tbody>
						{list?.map((e, i) => {
							if(e.Group_Date) {

								return <tr className='date-row' key={i}>
									<td><label className='date'>{formatDate(e.Group_Date)}</label></td>
								</tr>

							} else {

								return (
									<tr key={i} className='listElement' style={{ display: 'block' }} onClick={() => handleClick(e)}>
										{session?.List_PlayerOrder?.map((alias, j) => {
											const player = getPlayer(alias)
											return (<td key={`${i}.${j}`} style={style}>{e.PlayerScores[player.Alias]}</td>)
										})}
									</tr>
								)

							}
						})}
						<tr ref={listelement_ref}/>
					</tbody>
				</table>
			</div>
			


			<Loader loaderVisible={loaderVisible}/>
			
			<button className='button button-thick' onClick={play}>Los geht's!</button>

			<CustomLink linkTo='/selectsession' text='Zurück'/>

		</>
	)
}
