


import './scss/Preview.scss'
import 'react-calendar/dist/Calendar.css'


import Calendar from 'react-calendar'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from '../../components/Popup/Popup'
import CustomButton from '../../components/others/Custom_Button'
import OptionsDialog from '../../components/Popup/Popup_Options'
import CustomLink from '../../components/NavigationElements/CustomLink'
import PopupEditPlayers from '../../components/Popup/Popup_EditPlayers'





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
	const [ loading_request_finalscores, setLoading_request_finalscores ] = useState(false)

	const [ show_settings, setShow_settings ] = useState(false)

	const height_dateElement = 70
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

	const sync_horizontal_scroll = ( container ) => {

		// Sync horizontal scroll on both 'tables' so they align 

		const p = container_players.current
		const g = container_games.current

		if(!p || !g) return
		if(container === 'container_players') {
			g.scrollLeft = p.scrollLeft
		} else {
			p.scrollLeft = g.scrollLeft
		}

	}










	return (<>

		<OptionsDialog
			user={user}
			setUser={setUser}
		/>





		<div className='preview'>

			<header>
				<button
					onClick={() => setShow_settings(true)}
					className='button button-reverse button-reverse'
				>
					<svg viewBox='0 -960 960 960'><path d='m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z'/></svg>
					<span>Einstellungen</span>
				</button>
			</header>



			<div 
				ref={container_players} 
				className='preview_table-container' 
				onScroll={() => sync_horizontal_scroll('container_players')}
			>
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



			<div 
				ref={container_games} 
				className='preview_list' 
				onScroll={() => { handleScroll(); sync_horizontal_scroll('container_games') }}
			>
				<ul 
					ref={table_ref}
					className='preview_list_scores' 
				>
					{list_finalScores?.map((e, i) => {
						if(e.Group_Date) {

							const day = new Date(e.Group_Date).getDate()
							const month = new Date(e.Group_Date).getMonth() + 1
							const year = new Date(e.Group_Date).getFullYear()

							return (
								<li 
									key={i}
									className='preview_list_element-date'
								>
									<span>
										{session?.View === 'show_month' && `${day}.`}
										{session?.View === 'show_year' && `${day}.${month}.`}
										{(session?.View === 'custom_date' || session?.View === 'show_all') && `${day}.${month}.${year}`}
									</span>
								</li>
							)

						} else {

							return (
								<li 
									key={i} 
									className='preview_list_element-scores' 
									// onClick={() => navigate(`/session/preview/table?session_id=${session?.id}&finalscore_id=${e.id}`, { replace: false })}
									onClick={() => alert('Noch nicht implementiert.')}
								>
									{list_players?.map((player, index_player) => 
										<div key={`${i}.${index_player}`}>
											<span>
												{e.PlayerScores[player.id]}
											</span>
										</div>
									)}
								</li>
							)

						}
					})}
				</ul>
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

		<PopupEditPlayers
			request_finalscores={request_finalscores}

			setShow_customDate={setShow_customDate}

			setShow_editPlayers={setShow_settings}
			show_editPlayers={show_settings}

			setSession={setSession}
			session={session}

			setList_players={setList_players}
			list_players={list_players}

			show_edit_customDate={true}
		/>

	</>)
}
