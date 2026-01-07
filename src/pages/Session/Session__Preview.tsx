


import './scss/Session_Preview.scss'
import 'react-calendar/dist/Calendar.css'

import Calendar from 'react-calendar'
import { useInView } from 'react-intersection-observer'
import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'
import Context__Universal_Loader from '../../Provider_And_Context/Provider_And_Context__Universal_Loader'

import Popup from '../../components/Popup/Popup'
import Custom_Button from '../../components/misc/Custom_Button'
import OptionsDialog from '../../components/Popup/Popup__Options'
import Popup__Dropdown from '../../components/Popup/Popup__Dropdown'
import Custom_Link from '../../components/NavigationElements/Custom_Link'
import Popup__Edit_Preview from '../../components/Popup/Popup__Edit_Preview'

import Settings from '../../svg/Settings.svg'
import List_Sort from '../../svg/List_Sort.svg'

import { get__user } from '../../api/user'
import { get__final_scores_page } from '../../api/final_score'
import { get__session_players } from '../../api/session/session_players'
import { get__session, patch__session_date } from '../../api/session/session'

import type { Type__Session } from '../../types/Type__Session'
import type { Type__Client_To_Server__Session_Date__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session_Date__PATCH'
import type { Type__Server_Response__Final_Score__GET } from '../../types/Type__Server_Response/Type__Server_Response__Final_Score__GET'
import type { Type__Server_Reponse__Player__Get } from '../../types/Type__Server_Response/Type__Server_Response__Player__GET'





export default function Session__Preview() {
	
	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { session_id } = useParams()
	const ref_edit_list = useRef<HTMLButtonElement>(null)
	const ref_edit_session = useRef<HTMLButtonElement>(null)
	
	const [ loading_preparing_game, setLoading_preparing_game	] = useState<boolean>(false)

	const [ show_edit_session,		setShow_edit_session		] = useState<boolean>(false)
	const [ show_edit_list,			setShow_edit_list			] = useState<boolean>(false)

	const height_dateElement = 70
	const height_element = 70





	// __________________________________________________ Queries __________________________________________________
		
	// ____________________ User ____________________

	const { data: user, isLoading: isLoading__user, error: error__user } = useQuery({
		queryFn: () => get__user(axiosPrivate), 
		queryKey: [ 'user' ], 
	})

	if(error__user) {
		handle_error({
			err: error__user, 
		})
	}
	
	
	// ____________________ Session ____________________

	const [ session, setSession ] = useState<Type__Session>()

	const { data: tmp__session, isLoading: isLoading__session, error: error__session } = useQuery({
		queryFn: () => get__session(axiosPrivate, +(session_id || -1)), 
		queryKey: [ 'session', +(session_id || -1) ], 
	})

	if(error__session) {
		handle_error({
			err: error__session, 
			handle_404: () => {
				alert('Die Partie wurde nicht gefunden.')
				navigate('/', { replace: true })
			}
		})
	}

	useEffect(() => { setSession(tmp__session) }, [ tmp__session ])


	// ____________________ List_Players ____________________

	const { data: list_players, isLoading: isLoading__list_players, error: error__list_players } = useQuery({
		queryKey: [ 'session', +(session_id || -1), 'players' ], 
		queryFn: () => get__session_players(axiosPrivate, +(session_id || -1)), 
	})

	if(error__list_players) {
		handle_error({
			err: error__list_players, 
			handle_404: () => {
				alert('Die Partie wurde nicht gefunden.')
				navigate('/', { replace: true })
			}
		})
	}


	// ____________________ List_FinalScores ____________________

	const [ list_finalScores, setList_finalScores ] = useState<Array<Type__Final_Score>>([])

	const { ref, inView } = useInView()
	const { 
		data, 
		error, 
		refetch, 
		fetchNextPage, 
		isFetchingNextPage, 
		isLoading: isLoading__list_finalscores, 
	} = useInfiniteQuery({
		queryFn: ({ pageParam }) => get__final_scores_page(axiosPrivate, +(session_id || -1), pageParam), 
		queryKey: [ 'session', +(session_id || -1), 'finalscores' ],  
		getNextPageParam: prevData => prevData.nextPage, 
		initialPageParam: 1, 
	})

	useEffect(() => { if(inView) fetchNextPage() }, [ fetchNextPage, inView ])





	// __________________________________________________ Universal Loader __________________________________________________

	const { setLoading__universal_loader } = useContext(Context__Universal_Loader)
	useEffect(() => setLoading__universal_loader(isLoading__user || isLoading__session || isLoading__list_players || isLoading__list_finalscores || isFetchingNextPage), [ setLoading__universal_loader, isLoading__user, isLoading__session, isLoading__list_players, isLoading__list_finalscores, isFetchingNextPage ])

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

	const [ show_customDate, setShow_customDate ] = useState<boolean>(false)
	const [ view_customDate, setView_customDate ] = useState<Date>(new Date())

	const mutate__custom_date = useMutation({
		mutationFn: (json: Type__Client_To_Server__Session_Date__PATCH) => patch__session_date(axiosPrivate, json), 
		onSuccess: (_, json) => {
			setSession(prev => {
				if(!prev) return prev
				const tmp = { ...prev }
				tmp.View_CustomDate = json.View_CustomDate
				query_client.setQueryData([ 'session', session?.id ], tmp)
				return tmp
			})
			setShow_customDate(false)
		}, 
		onError: err => {
			handle_error({
				err, 
				handle_404: () => {
					alert('Die Partie wurde nicht gefunden.')
					navigate('/', { replace: true })
				}
			})
		}
	})

	const save_customDate = () => {

		mutate__custom_date.mutate({ 
			View_CustomDate: 	view_customDate, 
			SessionID: 			session?.id || -1, 
		})

	}
	




	// __________________________________________________ Scroll __________________________________________________

	const [ rowHeights,			setRowHeights			] = useState<Array<number>>([])
	const [ index_visible_row,	setIndex_visible_row	] = useState<number>(0)

	const handle_scroll = (event: React.UIEvent<HTMLUListElement>) => {

		const target = event.target as HTMLDivElement

		const scrollTop = target.scrollTop
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
	

	interface Type__Final_Score {
		id:								Type__Server_Response__Final_Score__GET['id']
		Group_Date:						Date
		Wins__After:					Record<Type__Server_Reponse__Player__Get['id'], number>
		Wins__After_Month:				Record<Type__Server_Reponse__Player__Get['id'], number>
		Wins__After_Year:				Record<Type__Server_Reponse__Player__Get['id'], number>
		Wins__After_SinceCustomDate:	Record<Type__Server_Reponse__Player__Get['id'], number>
		PlayerScores:					Record<Type__Server_Reponse__Player__Get['id'], number>
	}
	
	useEffect(() => {
		
		// Filters list so that only relevant elements are displayed and date is added
		function edit_list( 
			list_toEdit:	Array<Type__Server_Response__Final_Score__GET>, 
			setList_toEdit:	React.Dispatch<React.SetStateAction<Array<Type__Final_Score>>>, 
		) {
	
			if(!list_toEdit || list_toEdit.length === 0) return setList_toEdit([])
	
			const list_visibleFinalScores: Array<Type__Final_Score> = []
			const rowHeights: Array<number> = []
	
			const first = new Date(list_toEdit[0].End)
			list_visibleFinalScores.push({ 
				id:								list_toEdit[0].id, 
				Group_Date: 					first, 
				Wins__After: 					list_toEdit[0].Wins__After, 
				Wins__After_Month: 				list_toEdit[0].Wins__After_Month,
				Wins__After_Year: 				list_toEdit[0].Wins__After_Year, 
				Wins__After_SinceCustomDate:	list_toEdit[0].Wins__After_SinceCustomDate,
				PlayerScores:					list_toEdit[0].PlayerScores, 
			})
			let currentDate = first
		
			list_toEdit.forEach(e => {
				const date = new Date(e.End)
				const final_score: Type__Final_Score = { 
						id:								e.id, 
						Group_Date: 					date, 
						Wins__After:					e.Wins__After, 
						Wins__After_Month:				e.Wins__After_Month,
						Wins__After_Year:				e.Wins__After_Year, 
						Wins__After_SinceCustomDate:	e.Wins__After_SinceCustomDate,
						PlayerScores:					e.PlayerScores, 
					}

				if(date.toDateString() !== currentDate.toDateString()) {
					rowHeights.push(height_dateElement)
					list_visibleFinalScores.push(final_score)
					currentDate = date
				}
				rowHeights.push(height_element)
				list_visibleFinalScores.push(final_score)
			})
	
			setRowHeights(rowHeights)
			setList_toEdit(list_visibleFinalScores)
	
		}
	
		if(isLoading__list_finalscores || !data) return 
		edit_list(data.pages.flatMap(data => data.list_finalscores), setList_finalScores)
	
	}, [ data, isLoading__list_finalscores ])





	return <>

		<OptionsDialog user={user}/>



		<div className='session_preview'>

			<header>

				<button
					ref={ref_edit_list}
					onClick={() => setShow_edit_list(true)}
					className='button button_reverse button_scale_2'
				>
					<List_Sort/>
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
										if(!e) return

										return (
											<td key={id}>
												<span>
													{session?.View === 'show_month' && (e.Wins__After_Month[id] || 0)}
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
										className={`session_preview_list_element-scores${!list_finalScores[index_final_score + 1] || list_finalScores[index_final_score + 1]?.Group_Date ? '' : ' no_border_bottom'}${!list_finalScores[index_final_score - 1] || list_finalScores[index_final_score - 1]?.Group_Date ? '' : ' no_border_top'}`}
									>
										<Link to={`/session/${session?.id}/preview/table/${final_score.id}`}>
											{list_players?.map((player, index_player) => 
												<div key={`${index_final_score}.${index_player}`}>
													<span>
														{final_score.PlayerScores[player.id]}
													</span>
												</div>
											)}
										</Link>
									</li>
								)

							}
						})}
						{(isLoading__list_finalscores || isFetchingNextPage) && <>
							<li>Wird geladen...</li>
						</>}
						{error && <li>Fehler...</li>}
					</ul>

				</div>
			</div>



			<Custom_Button
				text={`Los geht's!`}
				onClick={start_game}
				loading={loading_preparing_game}
			/>

			<Custom_Link 
				onClick={() => navigate('/',  { replace: false })}
				text='Zurück'
			/>

		</div>





		{/* __________________________________________________ Popup Calendar __________________________________________________ */}

		<Popup
			show_popup={show_customDate}
			setShow_popup={setShow_customDate}
			title='Beginn auswählen'
			className='session_preview_popup_calendar'
		>
			<div className='session_preview_popup'>
				<Calendar
					value={view_customDate}
					onChange={(cd) => setView_customDate(cd as Date)}
				/>

				<Custom_Button
					loading={mutate__custom_date.isPending}
					onClick={save_customDate}
					text='Speichern'
				/>
			</div>
		</Popup>





		{/* __________________________________________________ Popup Settings __________________________________________________ */}

		<Popup__Dropdown
			target_ref={ref_edit_session}
			show_popup={show_edit_session}
			setShow_popup={setShow_edit_session}
		>
			<div className='session_preview_popup_settings'>
				<Link
					className='button button_scale_1'
					to={`/session/${session?.id}/analytics`}
				>Statistiken</Link>

				<div className='session_preview_popup_settings-edit'>
					<span>Bearbeiten</span>

					<div>
						<Link
							className='button button_scale_1'
							to={`/session/${session?.id}`}
						>Partie</Link>
						<Link
							className='button button_scale_1'
							to={`/session/${session?.id}/players`}
						>Spieler</Link>
					</div>
				</div>
			</div>
		</Popup__Dropdown>





		{/* __________________________________________________ Popup Edit Preview __________________________________________________ */}

		{session && <>
			<Popup__Edit_Preview
				target_ref={ref_edit_list}

				setShow_customDate={setShow_customDate}

				setShow_popup={setShow_edit_list}
				show_popup={show_edit_list}
				
				setSession={setSession}
				session={session}
				refetch={refetch}

			/>
		</>}

	</>
}
