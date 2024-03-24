


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

	const [ session_id, setSession_id ] = useState(-1) 

	const [ session, setSession ] = useState()
	const [ list_players, setList_players ] = useState([])
	const [ list_finalScores, setList_finalScores ] = useState([])
	const [ list_visibleFinalScores, setList_visibleFinalScores ] = useState([])
	
	const [ loaderVisible, setLoaderVisible ] = useState(false)

	const [ view, setView ] = useState()
	const [ year, setYear ] = useState()
	const [ list_year, setList_year ] = useState([])
	const [ month, setMonth ] = useState()

	const list_months = [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ]

	const columnWidth = list_players?.length > 8 ? '75px' : (list_players?.length > 4 ? '125px' : '200px')
	const style = { width: columnWidth, minWidth: columnWidth, maxWidth: columnWidth, padding: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }

	const height_dateElement = 40
	const height_element = 51

	

	

	useEffect(() => {

		setLoaderVisible(true)

		const session_id = new URLSearchParams(location.search).get('session_id')

		if(!session_id) return navigate('/selectsession', { replace: true })
		setSession_id(+session_id)

		axiosPrivate.get(`/sessionpreview?session_id=${session_id}`).then(({ data }) => {

			const { Session, List_Players, List_FinalScores } = data
			setSession(Session)

			//Order players
			const tmpList_Players = []
			for(const alias of Session.List_PlayerOrder) {
				for(const p of List_Players) {
					if(alias === p.Alias) {
						tmpList_Players.push(p)
						break
					}
				}
			}
			setList_players(tmpList_Players)

			List_FinalScores.sort((a, b) => new Date(b.End) - new Date(a.End))
			setList_finalScores(List_FinalScores)

			const tmp_list_years = []
			for(const e of List_FinalScores) {
				const y = new Date(e.End).getFullYear()
				if(!tmp_list_years.includes(y)) tmp_list_years.push(y)
			}
			tmp_list_years.sort((a, b) => b - a)

			setMonth(localStorage.getItem('kniffel_sessionpreview_month') || new Date().getMonth())
			setYear(localStorage.getItem('kniffel_sessionpreview_year') || tmp_list_years[0])
			setView(localStorage.getItem('kniffel_sessionpreview_view') || 'showYear')
			setList_year(tmp_list_years)


		}).catch((err) => {

			const status = err?.response?.status
			if(status === 404) {
				window.alert('Die Session exisiert nicht!')
			} else if(status === 400) {
				window.alert('Die Anfrage ist falsch!')
			} else {
				console.log(err)
				window.alert('Beim Server trat ein Fehler auf!')
			}
			navigate('/selectsession', { replace: true })

		}).finally(() => {setLoaderVisible(false)})

	}, [])

	const editList = ( list_toEdit, setList_toEdit ) => {

		if(!list_toEdit || list_toEdit.length === 0) return

		const list_visibleFinalScores = []
		const rowHeights = []

		const first = new Date(list_toEdit[0].End)
		list_visibleFinalScores.push({ 
			Group_Date: first, 
			ScoresAfter: list_toEdit[0].ScoresAfter, 
			ScoresAfter_Month: list_toEdit[0].ScoresAfter_Month,
			ScoresAfter_Year: list_toEdit[0].ScoresAfter_Year, 
			ScoresAfter_SinceCustomDate: list_toEdit[0].ScoresAfter_SinceCustomDate,
		})
		let currentDate = first
	
		list_toEdit.forEach(e => {
			const d = new Date(e.End)
			if(d.toDateString() !== currentDate.toDateString()) {
				rowHeights.push(height_dateElement)
				list_visibleFinalScores.push({ 
					Group_Date: d, 
					ScoresAfter: e.ScoresAfter, 
					ScoresAfter_Month: e.ScoresAfter_Month,
					ScoresAfter_Year: e.ScoresAfter_Year, 
					ScoresAfter_SinceCustomDate: e.ScoresAfter_SinceCustomDate,
				})
				currentDate = d
			}
			rowHeights.push(height_element)
			list_visibleFinalScores.push(e)
		})

		setRowHeights(rowHeights)
		setList_toEdit(list_visibleFinalScores)

	}





	useEffect(() => {

		if(!session) return

		localStorage.setItem('kniffel_sessionpreview_view', view)
		localStorage.setItem('kniffel_sessionpreview_month', month)
		localStorage.setItem('kniffel_sessionpreview_year', year)


		if(view === 'all') return editList(list_finalScores, setList_visibleFinalScores)

		const tmp = []

		for(const f of list_finalScores) {
			
			const date = new Date(f.End)
			if(date.getFullYear() === +year) {
				if(view === 'showMonth' && date.getMonth() !== +month) continue
				tmp.push(f)
			}

		}

		editList(tmp, setList_visibleFinalScores)

	}, [view, year, month])

	const getScoresAfter = (alias) => {

		if(!list_visibleFinalScores) return

		switch(view) {
			case 'showMonth':
				return list_visibleFinalScores.at(visibleRowIndex)?.ScoresAfter_Month[alias]

			case 'showYear':
				return list_visibleFinalScores.at(visibleRowIndex)?.ScoresAfter_Year[alias]

			case 'showCustomDate':
				return list_visibleFinalScores.at(visibleRowIndex)?.ScoresAfter_SinceCustomDate[alias]

			default :
				return list_visibleFinalScores.at(visibleRowIndex)?.ScoresAfter[alias]
		}


	}






	const getPlayer = (alias) => {

		for(const p of list_players) {
			if(p.Alias === alias) {
				return p
			}
		}

	}

	const play = () => {

		axiosPrivate.post('/sessionpreview', { SessionID: session_id }).then(({ data }) => {

			navigate(`/game?session_id=${session_id}&joincode=${data.JoinCode}`, { replace: true })

		}).catch((err) => {

			const status = err?.response?.status
			if(status === 400) {
				window.alert('Fehlerhafte Anfrage!\nIrgendwas stimmt mit der Session nicht.')
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

		navigate(`/sessionpreview/table?session_id=${session_id}&finalscore_id=${finalScore.id}`, { replace: false })

	}

	



	// __________________________________________________ Scroll __________________________________________________

	const [ visibleRowIndex, setVisibleRowIndex ] = useState(0)
	const div_ref = useRef(null)
	const table_ref = useRef(null)
	const listelement_ref = useRef(null)
	const [ rowHeights, setRowHeights ] = useState([])

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
					<option key={3} value='showCustomDate'>Benutzerdefiniert</option>
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
					{list_months.map((m, i) => 
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
										{getScoresAfter(alias)}
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
						{list_visibleFinalScores?.map((e, i) => {
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
