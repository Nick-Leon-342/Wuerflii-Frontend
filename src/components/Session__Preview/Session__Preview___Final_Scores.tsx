

import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

import { get__final_scores_page } from '@/api/final_score'

import type { Type__Final_Score__Session_Preview } from '@/types/Type__Final_Score__Session_Preview'
import type { Type__Final_Score } from '@/types/Type__Final_Score'
import type { Type__Session } from '@/types/Type__Session'
import type { Type__Player } from '@/types/Type__Player'

import { Button } from '../ui/button'





interface Props___Session__Preview___Final_Scores {
	setCurrent_top_row:	React.Dispatch<React.SetStateAction<Type__Final_Score | undefined>>
	list__players?:		Array<Type__Player>
	session?:			Type__Session
}

export default function Session__Preview___Final_Scores({
	setCurrent_top_row, 
	list__players, 
	session, 
}: Props___Session__Preview___Final_Scores) {

	const navigate	= useNavigate()
	const { t }		= useTranslation()

	const height_dateElement = 70
	const height_element = 70


	// ____________________ List_FinalScores ____________________

	const [ list__final_scores, setList__final_scores ] = useState<Array<Type__Final_Score__Session_Preview>>([])

	const { ref, inView } = useInView()
	const { 
		data, 
		error, 
		fetchNextPage, 
		isFetchingNextPage, 
		isLoading: isLoading__list_finalscores, 
	} = useInfiniteQuery({
		queryFn: ({ pageParam }) => get__final_scores_page(+(session?.id || -1), pageParam), 
		queryKey: [ 'session', +(session?.id || -1), 'finalscores' ], 
		getNextPageParam: prevData => prevData.nextPage, 
		initialPageParam: 1, 
		enabled: !!session, 
	})

	useEffect(() => { if(inView) fetchNextPage() }, [ fetchNextPage, inView ])
	




	// __________________________________________________ Scroll __________________________________________________

	const [ rowHeights, setRowHeights ] = useState<Array<number>>([])

	
	
	useEffect(() => {
		
		// Filters list so that only relevant elements are displayed and date is added
		function edit_list(list_toEdit: Array<Type__Final_Score>) {
	
			if(!list_toEdit || list_toEdit.length === 0) return setList__final_scores([])
				
			const list_visibleFinalScores: Array<Type__Final_Score__Session_Preview> = []
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
				const final_score: Type__Final_Score__Session_Preview = { 
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
			setList__final_scores(list_visibleFinalScores)
	
		}
	
		if(isLoading__list_finalscores || !data) return 
		const list = data.pages.flatMap(data => data.list_finalscores)
		if(list__final_scores.length === 0 && list.length > 0) setCurrent_top_row(list[0])
		edit_list(list)
	
	}, [ data, isLoading__list_finalscores ])

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

		setCurrent_top_row(data?.pages.flatMap(data => data.list_finalscores).find(final_score => final_score.id === list__final_scores[index_newRow].id))

	}





	return <>
		<ul 
			onScroll={handle_scroll}
			className='flex flex-col max-h-100 overflow-y-scroll [&_li]:h-[70px] [scrollbar-gutter:stable_both-edges]'
		>
			{list__final_scores?.map((final_score, index_final_score) => {

				const tmp_ref = list__final_scores.length - 1 === index_final_score ? ref : null

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
							className='flex flex-row shrink-0'
						>
							<Button 
								className={`flex flex-row justify-baseline gap-0 p-0 w-full h-full overflow-hidden border border-muted-foreground${!list__final_scores[index_final_score + 1] || list__final_scores[index_final_score + 1]?.Group_Date ? '' : ' border-b-0 rounded-b-none'}${!list__final_scores[index_final_score - 1] || list__final_scores[index_final_score - 1]?.Group_Date ? '' : ' rounded-t-none'}`}
								onClick={() => navigate(`/session/${session?.id}/preview/table/${final_score.id}`, { replace: false })}
								variant='ghost'
							>
								{list__players?.map((player, index_player) => 
									<div 
										key={`${index_final_score}.${index_player}`}
										className='grid place-items-center w-full h-full not-last-of-type:border-r border-muted-foreground min-w-30'
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
	</>
}
