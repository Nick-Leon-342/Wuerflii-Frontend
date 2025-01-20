


import './scss/Session_Preview.scss'
import 'react-calendar/dist/Calendar.css'

import Calendar from 'react-calendar'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from '../../components/Popup/Popup'
import Loader from '../../components/Loader/Loader'
import LoaderBox from '../../components/Loader/Loader_Box'
import CustomButton from '../../components/others/Custom_Button'
import OptionsDialog from '../../components/Popup/Popup_Options'
import PopupDropdown from '../../components/Popup/Popup_Dropdown'
import useInfiniteScrolling from '../../hooks/useInfiniteScrolling'
import CustomLink from '../../components/NavigationElements/CustomLink'
import PopupEditPreview from '../../components/Popup/Popup_Edit_Preview'





export default function Session_Preview() {
	
	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { session_id } = useParams()
	const ref_edit_list = useRef()
	const ref_edit_session = useRef()

	const [ user, setUser ] = useState()
	const [ session, setSession ] = useState()
	const [ list_players, setList_players ] = useState([])
	const [ list_finalScores, setList_finalScores ] = useState([])
	
	const [ loading_request, setLoading_request ] = useState(false)
	const [ loading_play, setLoading_play ] = useState(false)

	const [ show_edit_session, setShow_edit_session ] = useState(false)
	const [ show_edit_list, setShow_edit_list ] = useState(false)

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










	return <>

		<OptionsDialog
			user={user}
			setUser={setUser}
		/>



		<div className='session_preview'>

			{loading_request && <Loader loading={true}/>}

			{!loading_request && <>
				<header>
					<button
						ref={ref_edit_list}
						onClick={() => setShow_edit_list(true)}
						className='button button-reverse button-reverse'
					>
						<svg viewBox='0 -960 960 960'><path d='M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z'/></svg>
						<span>Liste</span>
					</button>

					<button
						ref={ref_edit_session}
						onClick={() => setShow_edit_session(true)}
						className='button button-reverse button-reverse'
					>
						<span>Bearbeiten</span>
						<svg viewBox='0 -960 960 960'><path d='M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z'/></svg>
					</button>
				</header>
			</>}



			<div className='session_preview_body'>
				<div className='session_preview_body-container'>
					
					{/* __________________________________________________ Table __________________________________________________ */}

					{!loading_request && <>
						<div className='session_preview_table-container'>
							<table className='table session_preview_table'>
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
							className='session_preview_list'
							onScroll={handle_scroll}
						>
							{list_finalScores?.map((final_score, index_final_score) => {

								const tmp_ref = list_finalScores.length - 1 === index_final_score ? ref : 	null

								if(final_score.Group_Date) {

									const day = new Date(final_score.Group_Date).getDate()
									const month = new Date(final_score.Group_Date).getMonth() + 1
									const year = new Date(final_score.Group_Date).getFullYear()

									return (
										<li 
											ref={tmp_ref}
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
											ref={tmp_ref}
											key={index_final_score} 
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
					onClick={() => navigate(`/game?session_id=${session?.id}`, { replace: false })}
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
			className='session_preview_popup_calendar'
		>
			<div className='session_preview_popup'>
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

		<PopupDropdown
			target_ref={ref_edit_session}
			show_popup={show_edit_session}
			setShow_popup={setShow_edit_session}
			className='session_preview_popup_edit_session'
		>
			<button
				className='button'
				onClick={() => navigate(`/session/${session.id}`, { replace: false })}
			>Partie</button>
			<button
				className='button'
				onClick={() => navigate(`/session/${session.id}/players`, { replace: false })}
			>Spieler</button>
		</PopupDropdown>

		<PopupEditPreview
			setShow_customDate={setShow_customDate}
			show_customDate={show_customDate}

			setShow_popup={setShow_edit_list}
			show_popup={show_edit_list}
			
			setSession={setSession}
			session={session}

		/>

	</>
}
