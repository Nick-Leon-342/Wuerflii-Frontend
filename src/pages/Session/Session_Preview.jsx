


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

import { ReactComponent as Settings } from '../../svg/Settings.svg'
import { ReactComponent as ListSort } from '../../svg/List_Sort.svg'





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

	const [ show_edit_session, setShow_edit_session ] = useState(false)
	const [ show_edit_list, setShow_edit_list ] = useState(false)

	const height_dateElement = 70
	const height_element = 70

	const [ url, setURL ] = useState('')
	const { ref, loading, error, list } = useInfiniteScrolling({ 
		url,  
		handle_404: () => navigate('/', { replace: true })
	})

	

	

	useEffect(() => {

		if(!session_id) return navigate('/', { replace: true })
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
			setView_customDate(Session.View_CustomDate)

			setURL(`/session/preview/all?session_id=${Session.id}`)


		}).catch((err) => {

			handle_error({ 
				err, 
				handle_404: () => navigate('/', { replace: true }) 
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
			Wins__After: list_toEdit[0].Wins__After, 
			Wins__After_Month: list_toEdit[0].Wins__After_Month,
			Wins__After_Year: list_toEdit[0].Wins__After_Year, 
			Wins__After_SinceCustomDate: list_toEdit[0].Wins__After_SinceCustomDate,
		})
		let currentDate = first
	
		list_toEdit.forEach(e => {
			const d = new Date(e.End)
			if(d.toDateString() !== currentDate.toDateString()) {
				rowHeights.push(height_dateElement)
				list_visibleFinalScores.push({ 
					Group_Date: d, 
					Wins__After: e.Wins__After, 
					Wins__After_Month: e.Wins__After_Month,
					Wins__After_Year: e.Wins__After_Year, 
					Wins__After_SinceCustomDate: e.Wins__After_SinceCustomDate,
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
	const [ view_customDate, setView_customDate ] = useState()
	const [ loading_customDate, setLoading_customDate ] = useState(false)

	const save_customDate = () => {

		setLoading_customDate(true)

		axiosPrivate.post('/session/date', { 
			View_CustomDate: view_customDate, 
			SessionID: session.id, 
		}).then(() => {

			setSession(prev => {
				const tmp = { ...prev }
				tmp.View_CustomDate = view_customDate
				return tmp
			})
			setShow_customDate(false)

		}).catch((err) => {

			handle_error({
				err, 
				handle_404: () => navigate('/', { replace: true })
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
						className='button button_reverse button_scale_2'
					>
						<ListSort/>
						<span>Liste</span>
					</button>

					<button
						ref={ref_edit_session}
						onClick={() => setShow_edit_session(true)}
						className='button button_reverse button_scale_1'
					>
						<span>Einstellungen</span>
						<Settings/>
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
														{session?.View === 'show_month' && (e?.Wins__After_Month[id] || 0)}
														{session?.View === 'show_year' && (e?.Wins__After_Year[id] || 0)}
														{session?.View === 'show_custom_date' && (e?.Wins__After_SinceCustomDate[id] || 0)}
														{session?.View === 'show_all' && (e?.Wins__After[id] || 0)}
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
											className='session_preview_list_element-date'
										>
											<span>
												{session?.View === 'show_month' && `${day}.`}
												{session?.View === 'show_year' && `${day}.${month}.`}
												{(session?.View === 'show_custom_date' || session?.View === 'show_all') && `${day}.${month}.${year}`}
											</span>
										</li>
									)

								} else {

									return (
										<li 
											ref={tmp_ref}
											key={index_final_score} 
											onClick={() => navigate(`/session/${session?.id}/preview/table/${final_score?.id}`, { replace: false })}
											className={`session_preview_list_element-scores${!list_finalScores[index_final_score + 1] || list_finalScores[index_final_score + 1]?.Group_Date ? '' : ' no_border_bottom'}`}
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
							{loading && <li><LoaderBox className='session_preview_list_loader' dark={true}/></li>}
							{error && <li>Fehler...</li>}
						</ul>
					</>}

				</div>
			</div>



			{!loading_request && <>
				<CustomButton
					text={`Los geht's!`}
					onClick={() => navigate(`/game?session_id=${session?.id}`, { replace: false })}
				/>
			</>}

			<CustomLink 
				onClick={() => navigate('/',  { replace: false })}
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
					value={view_customDate}
					onChange={(cd) => setView_customDate(cd)}
				/>

				<CustomButton
					loading_request={loading_customDate}
					text='Speichern'
					onClick={save_customDate}
				/>
			</div>
		</Popup>





		{/* __________________________________________________ Popup Settings __________________________________________________ */}

		<PopupDropdown
			target_ref={ref_edit_session}
			show_popup={show_edit_session}
			setShow_popup={setShow_edit_session}
		>
			<div className='session_preview_popup_settings'>
				<a
					className='button button_scale_1'
					href={`/#/session/${session?.id}/analytics`}
				>Statistiken</a>

				<div className='session_preview_popup_settings-edit'>
					<span>Bearbeiten</span>

					<div>
						<a
							className='button button_scale_1'
							href={`/#/session/${session?.id}`}
						>Partie</a>
						<a
							className='button button_scale_1'
							href={`/#/session/${session?.id}/players`}
						>Spieler</a>
					</div>
				</div>
			</div>
		</PopupDropdown>





		{/* __________________________________________________ Popup Edit Preview __________________________________________________ */}

		<PopupEditPreview
			target_ref={ref_edit_list}

			setShow_customDate={setShow_customDate}

			setShow_popup={setShow_edit_list}
			show_popup={show_edit_list}
			
			setSession={setSession}
			session={session}

		/>

	</>
}
