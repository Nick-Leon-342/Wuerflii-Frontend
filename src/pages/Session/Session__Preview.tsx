

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useContext, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'

import Context__Universal_Loader from '../../Provider_And_Context/Provider_And_Context__Universal_Loader'
import useErrorHandling from '../../hooks/useErrorHandling'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import Popup__Edit_Preview from '../../components/Popup/Popup__Edit_Preview'
import Popup__Dropdown from '../../components/Popup/Popup__Dropdown'
import OptionsDialog from '../../components/Popup/Popup__Settings'
import Custom_Button from '../../components/misc/Custom_Button'
import Popup from '../../components/Popup/Popup'

import { get__session, patch__session_date } from '../../api/session/session'
import { get__session_players } from '../../api/session/session_players'
import { get__final_scores_page } from '../../api/final_score'
import { get__user } from '../../api/user'

import type { Type__Client_To_Server__Session_Date__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session_Date__PATCH'
import type { Type__Server_Response__Final_Score__GET } from '../../types/Type__Server_Response/Type__Server_Response__Final_Score__GET'
import type { Type__Server_Reponse__Player__Get } from '../../types/Type__Server_Response/Type__Server_Response__Player__GET'
import type { Type__Session } from '../../types/Type__Session'
import { Settings, SortDesc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'





export default function Session__Preview() {
	
	const navigate			= useNavigate()
	const { t, i18n }		= useTranslation()
	const query_client		= useQueryClient()
	const axiosPrivate		= useAxiosPrivate()
	const handle_error		= useErrorHandling()

	const { session_id }	= useParams()
	const ref_edit_list		= useRef<HTMLButtonElement>(null)
	const ref_edit_session	= useRef<HTMLButtonElement>(null)
	
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
				alert(t('session_not_found'))
				navigate('/', { replace: true })
			}
		})
	}

	useEffect(() => { setSession(tmp__session) }, [ tmp__session ])


	// ____________________ List__Players ____________________

	const { data: list_players, isLoading: isLoading__list_players, error: error__list_players } = useQuery({
		queryKey: [ 'session', +(session_id || -1), 'players' ], 
		queryFn: () => get__session_players(axiosPrivate, +(session_id || -1)), 
	})

	if(error__list_players) {
		handle_error({
			err: error__list_players, 
			handle_404: () => {
				alert(t('session_not_found'))
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
				tmp.View__Custom_Date = json.View__Custom_Date
				query_client.setQueryData([ 'session', session?.id ], tmp)
				return tmp
			})
			setShow_customDate(false)
			refetch()
		}, 
		onError: err => {
			handle_error({
				err, 
				handle_404: () => {
					alert(t('session_not_found'))
					navigate('/', { replace: true })
				}
			})
		}
	})

	const save_customDate = () => {

		mutate__custom_date.mutate({ 
			View__Custom_Date: 	view_customDate, 
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
		Group_Date:						Date | null
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
					Group_Date: 					null, 
					Wins__After:					e.Wins__After, 
					Wins__After_Month:				e.Wins__After_Month,
					Wins__After_Year:				e.Wins__After_Year, 
					Wins__After_SinceCustomDate:	e.Wins__After_SinceCustomDate,
					PlayerScores:					e.PlayerScores, 
				}
				
				if(date.toDateString() !== currentDate.toDateString()) {
					rowHeights.push(height_dateElement)
					const element__date_title = { ...final_score }
					element__date_title.Group_Date = date
					list_visibleFinalScores.push(element__date_title)
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



		<div className='session__preview flex flex-col w-9/10 lg:w-4xl gap-4'>

			<header className='flex flex-row justify-between'>

				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant='ghost'
							className='w-10 h-10'
						><SortDesc className='w-8! h-8!'/></Button>
					</PopoverTrigger>

					<PopoverContent>
						
					</PopoverContent>
				</Popover>

				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant='ghost'
							className='w-10 h-10'
						><Settings className='w-8! h-8!'/></Button>
					</PopoverTrigger>

					<PopoverContent align='end'>
						<Link
							className='button button_scale_1'
							to={`/session/${session?.id}/analytics`}
						>{t('statistics')}</Link>

						<div className='session__preview--popup--settings--edit'>
							<span>{t('edit')}</span>

							<div>
								<Link
									className='button button_scale_1'
									to={`/session/${session?.id}`}
								>{t('session')}</Link>
								<Link
									className='button button_scale_1'
									to={`/session/${session?.id}/players`}
								>{t('players')}</Link>
							</div>
						</div>
					</PopoverContent>
				</Popover>


			</header>



			<div className=''>
				
				{/* __________________________________________________ Table __________________________________________________ */}

				<div className='flex flex-col rounded-lg border-2 border-primary overflow-y-auto [scrollbar-gutter:stable_both-edges] bg-green-100'>
					<table className='w-full [&_tr]:flex [&_td]:grid [&_td]:place-content-center [&_td]:w-full [&_td]:not-last-of-type:border-r [&_td]:border-primary [&_td]:h-10 text-xl'>
						<tbody>
							<tr>
								{list_players?.map(player => (
									<td key={player.id}>
										<span>{player.Name}</span>
									</td>
								))}
							</tr>
							{list_finalScores.length > 0 && <>
								<tr className='border-t border-primary'>
									{list_players?.map(player => {

										const id = player.id
										const e = list_finalScores.at(index_visible_row)
										if(!e) return

										return (
											<td key={id}>
												<span>
													{session?.View === 'SHOW__MONTH' && (e.Wins__After_Month[id] || 0)}
													{session?.View === 'SHOW__YEAR' && (e?.Wins__After_Year[id] || 0)}
													{session?.View === 'SHOW__CUSTOM_DATE' && (e?.Wins__After_SinceCustomDate[id] || 0)}
													{session?.View === 'SHOW__ALL' && (e?.Wins__After[id] || 0)}
												</span>
											</td>
										)
										
									})}
								</tr>
							</>}
						</tbody>
					</table>
				</div>





				{/* __________________________________________________ List __________________________________________________ */}

				<ul 
					onScroll={handle_scroll}
					className='flex flex-col max-h-100 overflow-y-scroll [&_li]:h-[70px] [scrollbar-gutter:stable_both-edges]'
				>
					{list_finalScores?.map((final_score, index_final_score) => {

						const tmp_ref = list_finalScores.length - 1 === index_final_score ? ref : null

						if(final_score.Group_Date) {

							const date = new Date(final_score.Group_Date)

							return (
								<li 
									ref={tmp_ref}
									key={index_final_score}
									className='flex flex-row shrink-0 items-center'
								>
									<span className='translate-y-2 text-xl font-bold'>
										{session?.View === 'SHOW__MONTH' && format(date, 'dd.')}
										{session?.View === 'SHOW__YEAR' && format(date, 'dd.MM.')}
										{(session?.View === 'SHOW__CUSTOM_DATE' || session?.View === 'SHOW__ALL') && format(date, 'dd.MM.yyyy')}
									</span>
								</li>
							)

						} else {

							return (
								<li 
									ref={tmp_ref}
									key={index_final_score} 
									className={`flex flex-row shrink-0${!list_finalScores[index_final_score + 1] || list_finalScores[index_final_score + 1]?.Group_Date ? '' : ' no_border_bottom'}${!list_finalScores[index_final_score - 1] || list_finalScores[index_final_score - 1]?.Group_Date ? '' : ' no_border_top'}`}
								>
									<Button 
										variant='ghost'
										className='flex flex-row gap-0 p-0 w-full h-full border border-muted-foreground'
										onClick={() => navigate(`/session/${session?.id}/preview/table/${final_score.id}`, { replace: false })}
									>
										{list_players?.map((player, index_player) => 
											<div 
												key={`${index_final_score}.${index_player}`}
												className='grid place-items-center w-full h-full not-last-of-type:border-r border-muted-foreground'
											>
												<span>
													{final_score.PlayerScores[player.id]}
												</span>
											</div>
										)}
									</Button>
								</li>
							)

						}
					})}
					{(isLoading__list_finalscores || isFetchingNextPage) && <>
						<li>{t('loading')}...</li>
					</>}
					{error && <li>{t('error')}...</li>}
				</ul>

			</div>



			<Custom_Button
				text={t('lets_go')}
				onClick={start_game}
				loading={loading_preparing_game}
			/>

			<Button
				variant='link'
				className='p-0 w-fit h-fit text-md'
				onClick={() => navigate('/', { replace: false })}
			>{t('back')}</Button>

		</div>





		{/* __________________________________________________ Popup Calendar __________________________________________________ */}

		<Popup
			show_popup={show_customDate}
			setShow_popup={setShow_customDate}
			title={t('choose_beginning')}
			className='session__preview--popup--calendar'
		>
			<div className='session__preview--popup'>
				{/* TODO mit Shadcn machen */}
				{/* <Calendar
					locale={i18n.language}
					value={view_customDate}
					onChange={(cd) => setView_customDate(cd as Date)}
				/> */}

				<Custom_Button
					loading={mutate__custom_date.isPending}
					onClick={save_customDate}
					text={t('save')}
				/>
			</div>
		</Popup>





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
