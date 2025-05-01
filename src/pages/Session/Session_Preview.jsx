


import './scss/Session_Preview.scss'
import 'react-calendar/dist/Calendar.css'

import Calendar from 'react-calendar'
import { useInView } from 'react-intersection-observer'
import { useNavigate, useParams } from 'react-router-dom'
import React, { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from '../../components/Popup/Popup'
import Loader from '../../components/Loader/Loader'
import CustomButton from '../../components/others/Custom_Button'
import OptionsDialog from '../../components/Popup/Popup_Options'
import PopupDropdown from '../../components/Popup/Popup_Dropdown'
import CustomLink from '../../components/NavigationElements/CustomLink'
import PopupEditPreview from '../../components/Popup/Popup_Edit_Preview'

import { ReactComponent as Settings } from '../../svg/Settings.svg'
import { ReactComponent as ListSort } from '../../svg/List_Sort.svg'

import { get__user } from '../../api/user'
import { get__final_scores_page } from '../../api/final_score'
import { get__session_players } from '../../api/session/session_players'
import { get__session, patch__session_date } from '../../api/session/session'





export default function Session_Preview() {
	
	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { session_id } = useParams()
	const ref_edit_list = useRef()
	const ref_edit_session = useRef()
	
	const [ loading_preparing_game, setLoading_preparing_game ] = useState(false)

	const [ show_edit_session, setShow_edit_session ] = useState(false)
	const [ show_edit_list, setShow_edit_list ] = useState(false)

	const height_dateElement = 70
	const height_element = 70





	// __________________________________________________ Queries __________________________________________________	// TODO implement error handling
		
	// ____________________ User ____________________

	const { data: user, isLoading: isLoading__user, isError: isError__user } = useQuery({
		queryKey: [ 'user' ], 
		queryFn: () => get__user(axiosPrivate), 
	})
	
	
	// ____________________ Session ____________________

	const [ session, setSession ] = useState()

	const { data: tmp__session, isLoading: isLoading__session, isError: isError__session } = useQuery({
		queryKey: [ 'session', +session_id ], 
		queryFn: () => get__session(axiosPrivate, session_id), 
	})
	useEffect(() => setSession(tmp__session), [ tmp__session ])


	// ____________________ List_Players ____________________

	const { data: list_players, isLoading: isLoading__list_players, isError: isError__list_players } = useQuery({
		queryKey: [ 'session', +session_id, 'players' ], 
		queryFn: () => get__session_players(axiosPrivate, session_id), 
	})


	// ____________________ List_FinalScores ____________________

	const [ list_finalScores, setList_finalScores ] = useState([])

	const { ref, inView } = useInView()
	const { 
		data, 
		error, 
		refetch, 
		fetchNextPage, 
		isLoading: isLoading__list_finalscores, 
	} = useInfiniteQuery({
		queryKey: [ 'session', +session_id, 'finalscores' ],  
		getNextPageParam: prevData => prevData.nextPage, 
		queryFn: ({ pageParam = 1 }) => get__final_scores_page(axiosPrivate, session_id, pageParam), 
	})
	useEffect(() => { if(inView) fetchNextPage() }, [ fetchNextPage, inView ])





	// Filters list so that only relevant elements are displayed and date is added
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
	
		if(isLoading__list_finalscores) return 
		edit_list(data?.pages.flatMap(data => data.list_finalscores), setList_finalScores)
	
	}, [ data, isLoading__list_finalscores ])

	const start_game = () => {

		if(session?.CurrentGameStart) return navigate(`/game?session_id=${session?.id}`, { replace: false })

		setLoading_preparing_game(true)
		axiosPrivate.get(`/game?session_id=${session?.id}`).then(() => {

			navigate(`/game?session_id=${session?.id}`, { replace: false })

		}).catch(err => {

			handle_error({
				err, 
			})

		}).finally(() => setLoading_preparing_game(true))

	}





	// __________________________________________________ Edit CustomDate __________________________________________________

	const [ show_customDate, setShow_customDate ] = useState(false)
	const [ view_customDate, setView_customDate ] = useState()

	const mutate__custom_date = useMutation({
		mutationFn: json => patch__session_date(axiosPrivate, json), 
		onSuccess: (_, json) => {
			setSession(prev => {
				const tmp = { ...prev }
				tmp.View_CustomDate = json.View_CustomDate
				query_client.setQueryData([ 'session', session.id ], tmp)
				return tmp
			})
			setShow_customDate(false)
		}, 
		onError: err => {
			handle_error({
				err, 
			})
		}
	})

	const save_customDate = () => {

		mutate__custom_date.mutate({ 
			View_CustomDate: view_customDate, 
			SessionID: session.id, 
		})

	}
	




	// __________________________________________________ Scroll __________________________________________________

	const [ rowHeights, setRowHeights ] = useState([])
	const [ index_visible_row, setIndex_visible_row ] = useState(0)

	const handle_scroll = event => {

		const scrollTop = event.target.scrollTop
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

		<OptionsDialog user={user}/>



		<div className='session_preview'>

			<header>

				<button
					ref={ref_edit_list}
					onClick={() => setShow_edit_list(true)}
					className='button button_reverse button_scale_2'
				>
					<ListSort/>
					<span>Liste</span>
				</button>



				<Loader loading={isLoading__user || isLoading__session || isLoading__list_players || isLoading__list_finalscores}/>



				<button
					ref={ref_edit_session}
					onClick={() => setShow_edit_session(true)}
					className='button button_reverse button_scale_1'
				>
					<span>Einstellungen</span>
					<Settings/>
				</button>

			</header>



			<div className='session_preview_body'>
				<div className='session_preview_body-container'>
					
					{/* __________________________________________________ Table __________________________________________________ */}

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

										return <>
											<td key={id}>
												<span>
													{session?.View === 'show_month' && (e?.Wins__After_Month[id] || 0)}
													{session?.View === 'show_year' && (e?.Wins__After_Year[id] || 0)}
													{session?.View === 'show_custom_date' && (e?.Wins__After_SinceCustomDate[id] || 0)}
													{session?.View === 'show_all' && (e?.Wins__After[id] || 0)}
												</span>
											</td>
										</>

									})}
								</tr>
							</tbody>
						</table>
					</div>





					{/* __________________________________________________ List __________________________________________________ */}

					<ul 
						className='session_preview_list'
						onScroll={handle_scroll}
					>
						{list_finalScores?.map((final_score, index_final_score) => {

							const tmp_ref = list_finalScores.length - 1 === index_final_score ? ref : null

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
						{error && <li>Fehler...</li>}
					</ul>

				</div>
			</div>



			<CustomButton
				text={`Los geht's!`}
				onClick={start_game}
				loading={loading_preparing_game}
			/>

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
					loading_request={mutate__custom_date.isPending}
					onClick={save_customDate}
					text='Speichern'
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
			refetch={refetch}

		/>

	</>
}
