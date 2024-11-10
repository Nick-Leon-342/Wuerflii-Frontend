


import './scss/Preview.scss'
import 'react-calendar/dist/Calendar.css'


import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { formatDate } from '../../logic/utils'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import Calendar from 'react-calendar'

import Popup from '../../components/others/Popup'
import CustomButton from '../../components/others/Custom_Button'
import OptionsDialog from '../../components/others/OptionsDialog'
import CustomLink from '../../components/NavigationElements/CustomLink'
import useErrorHandling from '../../hooks/useErrorHandling'





export default function Preview() {
	
	const navigate = useNavigate()
	const location = useLocation()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ user, setUser ] = useState()
	const [ session, setSession ] = useState()
	const [ list_players, setList_players ] = useState([])
	const [ list_finalScores, setList_finalScores ] = useState([])
	
	const [ loading, setLoading ] = useState(false)
	const [ loading_play, setLoading_play ] = useState(false)
	const [ loading_update_view, setLoading_update_view ] = useState(false)
	const [ loading_request_finalscores, setLoading_request_finalscores ] = useState(false)

	const list_months = [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ]

	const height_dateElement = 50
	const height_element = 70

	const container_players = useRef(null)
	const container_games = useRef(null)

	

	

	useEffect(() => {

		async function request() {
			
			const session_id = new URLSearchParams(location.search).get('session_id')
			if(!session_id) return navigate('/session/select', { replace: true })
			setLoading(true)
	
			let tmp_session
	
			await axiosPrivate.get(`/session/preview?session_id=${session_id}`).then(({ data }) => {
	
	
				const { 
					Session, 
					List_Players, 
					User, 
					Exists, 
				} = data
	
				tmp_session = Session
	
				if(Exists) return navigate(`/game?session_id=${session_id}`, { replace: true })
	
				setUser(User)
				setSession(Session)
				setList_players(List_Players)
				setCustomDate(Session.CustomDate)
	
	
			}).catch((err) => {
	
				handle_error({ 
					err, 
					handle_404: (() => {
						alert('Die Session exisiert nicht!')
						navigate('/session/select', { replace: true })
					}) 
				})
	
			}).finally(() => setLoading(false))
	
			request_finalscores(tmp_session)

		}

		request()
		
		// eslint-disable-next-line
	}, [])

	// Filters list so that only relevant elements are displayed and 
	const editList = ( list_toEdit, setList_toEdit ) => {

		if(!list_toEdit || list_toEdit.length === 0) return setList_toEdit([])

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

	const play = () => {

		setLoading_play(true)

		axiosPrivate.patch('/game/create', { SessionID: session.id }).then(() => {

			navigate(`/game?session_id=${session?.id}`, { replace: false })

		}).catch(err => {

			handle_error({
				err, 
				handle_404: () => {
					alert('Session nicht gefunden.')
					navigate('/session/select', { replace: true })
				}
			})

		}).finally(() => setLoading_play(false))

	}

	const update_view = async ( view, view_month, view_year ) => { 

		setLoading_update_view(true)

		await axiosPrivate.patch('/session', {
			SessionID: session.id, 
			View: view, 
			View_Month: view_month, 
			View_Year: view_year, 
		}).then(() => {


			setSession(prev => {
				const tmp = { ...prev }
				tmp.View = view
				tmp.View_Month = view_month
				tmp.View_Year = view_year
				return tmp
			})


		}).catch(err => {

			handle_error({
				err, 
				handle_404: () => {
					alert('Session nicht gefunden.')
					navigate('/session/select', { replace: false })
				}
			})

		}).finally(() => setLoading_update_view(false))

		request_finalscores(session)

	}

	const request_finalscores = ( session ) => {

		setLoading_request_finalscores(true)

		axiosPrivate.get(`/session/preview/all?session_id=${session.id}&offset=${0}`).then(({ data }) => {


			const { List_FinalScores } = data
			setList_finalScores(List_FinalScores)

			editList(List_FinalScores, setList_finalScores)


		}).catch(err => {

			handle_error({
				err, 
				handle_404: () => {
					alert('Session nicht gefunden.')
					navigate('/session/select', { replace: true })
				}
			})
			
		}).finally(() => setLoading_request_finalscores(false))

	}





	// __________________________________________________ Edit CustomDate __________________________________________________

	const [ show_customDate, setShow_customDate ] = useState(false)
	const [ customDate, setCustomDate ] = useState()
	const [ loading_customDate, setLoading_customDate ] = useState(false)

	const save_customDate = () => {

		setLoading_customDate(true)

		axiosPrivate.post('/session/date', { SessionID: session.id, CustomDate: customDate }).then(() => {

			setSession(prev => {
				const tmp = { ...prev }
				tmp.CustomDate = customDate
				return tmp
			})
			setShow_customDate(false)
			request_finalscores(session)

		}).catch((err) => {

			handle_error({
				err, 
				handle_404: () => {
					window.alert('Die Session wurde nicht gefunden!')
					navigate('/session/select', { replace: true })
				}
			})

		}).finally(() => setLoading_customDate(false))

	}
	




	// __________________________________________________ Scroll __________________________________________________

	const [ visibleRowIndex, setVisibleRowIndex ] = useState(0)
	const table_ref = useRef(null)
	const listelement_ref = useRef(null)
	const [ rowHeights, setRowHeights ] = useState([])

	const handleScroll = () => {

		if (!container_games.current || !table_ref.current) return

		const scrollTop = container_games.current.scrollTop
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

	const syncScroll = ( container ) => {

		const p = container_players.current
		const g = container_games.current

		if(!p || !g) return
		if(container === 'container_players') {
			g.scrollLeft = p.scrollLeft
		} else {
			p.scrollLeft = g.scrollLeft
		}

	}






	





	// // __________________________________________________Modal-Edit__________________________________________________

	// const [ columns, setColumns ] = useState('')
	// const maxColumns = process.env.REACT_APP_MAX_COLUMNS || 10
	// const options_columns = Array.from({ length: maxColumns }, (_, index) => index + 1)

	// const handle_edit_columnChange = (event) => {

	// 	const intValue = event.target.value
	// 	if (isNaN(parseInt(intValue.substr(intValue.length - 1))) || intValue < 1 || parseInt(intValue) > maxColumns) {return setColumns(intValue.slice(0, -1))}
	// 	setColumns(intValue)

	// }

	// const edit_show = () => {

	// 	// setSuccessfullyUpdatedVisible(false)
	// 	// setList_players(session?.List_PlayerOrder.map((alias) => getPlayer(alias)))
	// 	// setShow_editSession(true)

	// }

	// const edit_close = () => {
		
	// 	setList_players([])
	// 	setColumns('')
	// 	setShow_editSession(false)

	// }

	// const edit_save = async () => {

	// 	setLoading_edit(true)

	// 	axiosPrivate.post('/session/update', { SessionID: session.id, Columns: +columns, List_Players: list_players }).then(() => {

	// 		setSuccessfullyUpdatedVisible(true)
	// 		edit_close()
	// 		window.location.reload()

	// 	}).catch((err) => {

	// 		handle_error({ err, 
	// 			handle_404: (() => {
	// 				window.alert('Die Session wurde nicht gefunden!')
	// 				window.location.reload()
	// 			})
	// 		})

	// 	}).finally(() => { setLoading_edit(false) })		

	// }










	return (
		<>

			<OptionsDialog
				user={user}
				setUser={setUser}
			/>





			<div className='preview_container'>

				<div className='select-container'>

					<select 
						value={session?.View}
						onChange={({ target }) => update_view(target.value, session.View_Month, session.View_Year)}
					>
						<option key={0} value='show_all'>Gesamtansicht</option>
						<option key={1} value='show_year'>Jahresansicht</option>
						<option key={2} value='show_month'>Monatsansicht</option>
						<option key={3} value='custom_date'>Benutzerdefiniert</option>
					</select>

					{(session?.View === 'show_month' || session?.View === 'show_year') && <>
						<select 
							value={session.View_Year}
							onChange={({ target }) => update_view(session.View, session.View_Month, +target.value)}
						>
							{session?.View_List_Years.map((y, i) => 
								<option key={i} value={y}>{y}</option>
							)}
						</select>
					</>}

					{session?.View === 'show_month' && <>
						<select 
							value={session.View_Month}
							onChange={({ target }) => update_view(session.View, +target.value, session.View_Year)}
						>
							{list_months.map((m, i) => 
								<option key={i} value={i+1}>{m}</option>
							)}
						</select>
					</>}

					{session?.View === 'custom_date' && <>
						<label onClick={() => setShow_customDate(true)}>
							{`Ansicht ab: ${formatDate(session?.CustomDate)}` || 'Erstelle Ansicht'}
						</label>
					</>}

				</div>



				<div className='preview_table-container' ref={container_players} onScroll={() => syncScroll('container_players')}>
					<table className='table table_players'>
						<tbody>
							<tr>
								{list_players?.map(player => (
									<td key={player.id}>
										<span>{player.Name}</span>
									</td>
								))}
							</tr>
							<tr>
								{list_players?.map(player => {

									const id = player.id
									const e = list_finalScores.at(visibleRowIndex)

									return (
										<td key={id}>
											<span>
												{session?.View === 'show_month' && (e?.ScoresAfter_Month[id] || 0)}
												{session?.View === 'show_year' && (e?.ScoresAfter_Year[id] || 0)}
												{session?.View === 'custom_date' && (e?.ScoresAfter_SinceCustomDate[id] || 0)}
												{session?.View === 'show_all' && (e?.ScoresAfter[id] || 0)}
											</span>
										</td>
									)

								})}
							</tr>
						</tbody>
					</table>
				</div>



				<div className='preview_table-container' ref={container_games} onScroll={() => { handleScroll(); syncScroll('container_games') }}>
					<table className='table table_preview' ref={table_ref}>
						<tbody>
							{list_finalScores?.map((e, i) => {
								if(e.Group_Date) {

									const day = new Date(e.Group_Date).getDate()
									const month = new Date(e.Group_Date).getMonth() + 1
									const year = new Date(e.Group_Date).getFullYear()

									return (
										<tr 
											key={i}
											className='preview_list_date'
										>
											<td className='date'>
												<label>
													{session?.View === 'show_month' && `${day}.`}
													{session?.View === 'show_year' && `${day}.${month}.`}
													{(session?.View === 'custom_date' || session?.View === 'show_all') && `${day}.${month}.${year}`}
												</label>
											</td>
										</tr>
									)

								} else {

									return (
										<tr 
											key={i} 
											className='preview_list_element' 
											onClick={() => navigate(`/session/preview/table?session_id=${session?.id}&finalscore_id=${e.id}`, { replace: false })}
										>
											{list_players?.map((player, index_player) => 
												<td key={`${i}.${index_player}`}>{e.PlayerScores[player.id]}</td>
											)}
										</tr>
									)

								}
							})}
							<tr ref={listelement_ref}/>
						</tbody>
					</table>
				</div>



				<CustomButton
					loading={loading_play}
					text={`Los geht's!`}
					onClick={play}
				/>

				<CustomLink 
					onClick={() => navigate('/session/select',  { replace: false })}
					text='Zurück'
				/>

			</div>





			{/* __________________________________________________ Popup Calendar __________________________________________________ */}

			<Popup
				showPopup={show_customDate}
				setShowPopup={setShow_customDate}
				title='Beginn auswählen'
			>
				<div className='preview_popup'>
					<Calendar
						value={customDate}
						onChange={(cd) => setCustomDate(cd)}
					/>

					<CustomButton
						loading={loading_customDate}
						text='Speichern'
						onClick={save_customDate}
					/>
				</div>
			</Popup>











{/* __________________________________________________ Popup Edit __________________________________________________ */}

{/* <Popup
	showPopup={show_editSession}
	setShowPopup={setShow_editSession}
	title='Bearbeiten'
>
	<div className='select_popup_edit'>							


		
		<div className='columns'>

			<label>Spalten</label>
			
			<select
				value={columns}
				onChange={handle_edit_columnChange}
			>
				<option value={session?.Columns}>
					{'Derzeit: ' + session?.Columns}
				</option>
				{options_columns.map((c) => (
					<option key={c} value={c}>{c}</option>
				))}
			</select>

		</div>



		
		{list_players && <DragAndDropNameColorList List_Players={list_players} setList_Players={setList_players}/>}



		<CustomButton
			loading={loading_edit}
			onClick={edit_save}
			text='Speichern'
		/>

	</div>
</Popup> */}

		</>
	)
}
