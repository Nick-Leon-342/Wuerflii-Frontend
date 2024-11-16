


import './scss/Preview.scss'
import 'react-calendar/dist/Calendar.css'

import Calendar from 'react-calendar'
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from '../../components/Popup/Popup'
import Loader from '../../components/Loader/Loader'
import LoaderBox from '../../components/Loader/Loader_Box'
import CustomButton from '../../components/others/Custom_Button'
import OptionsDialog from '../../components/Popup/Popup_Options'
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling'
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
	
	const [ loading_request, setLoading_request ] = useState(false)
	const [ loading_play, setLoading_play ] = useState(false)

	const [ show_settings, setShow_settings ] = useState(false)

	const height_dateElement = 70
	const height_element = 70

	const [ url, setURL ] = useState('')
	const { ref, loading, error, list } = useInfiniteScrolling({ 
		url,  
		handle_404: () => {
			alert('Session nicht gefunden.')
			navigate('/session/select', { replace: true })
		}
	})

	

	

	useEffect(() => {

		const session_id = new URLSearchParams(location.search).get('session_id')
		if(!session_id) return navigate('/session/select', { replace: true })
		setLoading_request(true)


		axiosPrivate.get(`/session/preview?session_id=${session_id}`).then(({ data }) => {


			const { 
				Session, 
				List_Players, 
				User, 
				Exists, 
			} = data

			if(Exists) return navigate(`/game?session_id=${session_id}`, { replace: true })

			setUser(User)
			setSession(Session)
			setList_players(List_Players)
			setCustomDate(Session.CustomDate)

			setURL(`/session/preview/all?session_id=${Session.id}`)


		}).catch((err) => {

			handle_error({ 
				err, 
				handle_404: (() => {
					alert('Die Session exisiert nicht!')
					navigate('/session/select', { replace: true })
				}) 
			})

		}).finally(() => setLoading_request(false))
		
		// eslint-disable-next-line
	}, [])

	// Filters list so that only relevant elements are displayed and 
	const edit_list = ( list_toEdit, setList_toEdit ) => {

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

	useEffect(() => {

		// TODO surely could be solved way better, just 'temporarily' xD - Don't think imma change this at all
		if(!session) return
		setURL('')
		setTimeout(() => setURL(`/session/preview/all?session_id=${session.id}`), 10)

	}, [ session ])

	useEffect(() => {
	
		if(loading) return 
		edit_list(list, setList_finalScores)
	
	}, [ list, loading ])





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

	const [ index_visible_row, setIndex_visible_row ] = useState(0)
	const [ rowHeights, setRowHeights ] = useState([])

	const handle_scroll = ( e ) => {

		const scrollTop = e.target.scrollTop
		let totalHeight = 0
		let index_newRow = 0

		for (let i = 0; i < rowHeights.length; i++) {
			totalHeight += rowHeights[i]
			if(totalHeight > scrollTop) {
				index_newRow = i
				break
			}
		}

		setIndex_visible_row(index_newRow)

	}










	return (<>

		<OptionsDialog
			user={user}
			setUser={setUser}
		/>



		<div className='preview'>

			{loading_request && <Loader loading={true}/>}

			{!loading_request && <>
				<header>
					<button
						onClick={() => setShow_settings(true)}
						className='button button-reverse button-reverse'
					>
						<svg viewBox='0 -960 960 960'><path d='m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z'/></svg>
						<span>Einstellungen</span>
					</button>
				</header>
			</>}



			<div className='preview_body'>
				<div className='preview_body-container'>
					
					{/* __________________________________________________ Table __________________________________________________ */}

					{!loading_request && <>
						<div className='preview_table-container'>
							<table className='table preview_table'>
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
											const e = list_finalScores.at(index_visible_row)

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
					</>}





					{/* __________________________________________________ List __________________________________________________ */}

					{<>
						<ul 
							className='preview_list'
							onScroll={handle_scroll}
						>
							{list_finalScores?.map((final_score, index_final_score) => {
								if(final_score.Group_Date) {

									const day = new Date(final_score.Group_Date).getDate()
									const month = new Date(final_score.Group_Date).getMonth() + 1
									const year = new Date(final_score.Group_Date).getFullYear()

									return (
										<li 
											key={index_final_score}
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
											key={index_final_score} 
											ref={list.length - 1 === index_final_score ? ref : 	null}
											onClick={() => navigate(`/session/preview/table?session_id=${session?.id}&finalscore_id=${final_score?.id}`, { replace: false })}
											className={`preview_list_element-scores${!list_finalScores[index_final_score + 1] || list_finalScores[index_final_score + 1]?.Group_Date ? '' : ' no_border_bottom'}`}
										>
											{list_players?.map((player, index_player) => 
												<div key={`${index_final_score}.${index_player}`}>
													<span>
														{final_score.PlayerScores[player.id]}
													</span>
												</div>
											)}
										</li>
									)

								}
							})}
							{loading && <li><LoaderBox className='preview_list_loader' dark={true}/></li>}
							{error && <li>Fehler...</li>}
						</ul>
					</>}

				</div>
			</div>



			{!loading_request && <>
				<CustomButton
					loading_request={loading_play}
					text={`Los geht's!`}
					onClick={play}
				/>
			</>}

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
					loading_request={loading_customDate}
					text='Speichern'
					onClick={save_customDate}
				/>
			</div>
		</Popup>





		{/* __________________________________________________ Popup Edit __________________________________________________ */}

		<PopupEditPlayers
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
