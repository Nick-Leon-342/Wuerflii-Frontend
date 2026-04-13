

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import type { Type__Session, Type__Session_PATCH } from '../../types/Zod__Session'
import { Enum__Months } from '@/types/Enum/Enum__Months'
import useErrorHandling from '../../hooks/useErrorHandling'
import { patch__session } from '../../api/session/session'
import { Enum__View } from '@/types/Enum/Enum__View'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import Session__Preview___Calendar from './Session__Preview___Calendar'
import { SortDesc } from 'lucide-react'
import { Spinner } from '../ui/spinner'
import { Button } from '../ui/button'





interface Props___Session__Preview___Edit {
	setSession:			React.Dispatch<React.SetStateAction<Type__Session | undefined>>
	session?:			Type__Session
}

export default function Session__Preview___Edit({
	setSession, 
	session, 
}: Props___Session__Preview___Edit) {

	const { t } 		= useTranslation()
	const query_client 	= useQueryClient()
	const handle_error 	= useErrorHandling()

	const [ view,		setView			] = useState<(typeof Enum__View)[number]>('SHOW__ALL')
	const [ view_month, setView_month	] = useState<(typeof Enum__Months)[number]>('JANUARY')
	const [ view_year, 	setView_year	] = useState<number>(0)

	useEffect(() => {
		function init() {
			if(!session) return 
			setView(session.View)
			setView_month(session.View__Month)
			setView_year(session.View__Year)
		}
		init()
	}, [ session ])





	const mutate__session = useMutation({
		mutationFn: (json: Type__Session_PATCH) => patch__session(+(session?.id || -1), json), 
		onSuccess: (_, json) => {
			if(!session) return
			setSession(prev => {
				if(!prev) return prev
				const tmp 		= { ...prev }
				tmp.View 		= json.View			|| 'SHOW__ALL'
				tmp.View__Month = json.View__Month	|| 'JANUARY'
				tmp.View__Year 	= json.View__Year	|| 0
				query_client.setQueryData([ 'session', session.id ], tmp)
				return tmp
			})
			
			// Invalidate Query so that final_scores are being refetched
			query_client.invalidateQueries({ queryKey: [ 'session', +(session?.id || -1), 'finalscores' ] })

		}, 
		onError: err => {
			handle_error({
				err, 
			})
		}
	})

	function update_view(
		view:		(typeof Enum__View)[number], 
		view_month:	(typeof Enum__Months)[number], 
		view_year:	number
	): void {

		if(!session) return

		mutate__session.mutate({
			View:			view, 
			View__Month: 	view_month, 
			View__Year: 	view_year, 
		})

	}





	return <>
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='ghost'
					className='w-10 h-10'
				><SortDesc className='w-8! h-8!'/></Button>
			</PopoverTrigger>



			<PopoverContent align='start'>

				<div className='flex flex-col gap-4'>

					{/* ____________________ View ____________________ */}

					<Select
						value={view}
						disabled={mutate__session.isPending}
						onValueChange={(value) => update_view(value as (typeof Enum__View)[number], view_month, view_year)}
					>
						<SelectTrigger>
							<SelectValue/>
						</SelectTrigger>

						<SelectContent>
							<SelectGroup>
								<SelectLabel>{t('view.label')}</SelectLabel>
								{Enum__View.map(option => (
									<SelectItem
										key={option}
										value={option}
										className='text-lg cursor-pointer'
									>{t('view.' + option)}</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>



					{/* ____________________ Year ____________________ */}

					{(view === 'SHOW__MONTH' || view === 'SHOW__YEAR') && <>
						<Select
							value={view_year.toString()}
							disabled={mutate__session.isPending}
							onValueChange={(value) => update_view(view, view_month, +value)}
						>
							<SelectTrigger>
								<SelectValue/>
							</SelectTrigger>

							<SelectContent>
								<SelectGroup>
									<SelectLabel>{t('year')}</SelectLabel>
									{session?.View__List_Years.map(year => (
										<SelectItem
											key={year}
											value={year.toString()}
											className='text-lg cursor-pointer'
										>{year}</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</>}



					{/* ____________________ Month ____________________ */}

					{view === 'SHOW__MONTH' && <>
						<Select
							value={view_month}
							disabled={mutate__session.isPending}
							onValueChange={(value) => update_view(view, value as (typeof Enum__Months)[number], view_year)}
						>
							<SelectTrigger>
								<SelectValue/>
							</SelectTrigger>

							<SelectContent>
								<SelectGroup>
									<SelectLabel>{t('month')}</SelectLabel>
									{Enum__Months.map(month => (
										<SelectItem
											key={month}
											value={month}
											className='text-lg cursor-pointer'
										>{t('months.' + month)}</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</>}



					{/* ____________________ Custom_Date ____________________ */}

					{view === 'SHOW__CUSTOM_DATE' && <>
						<Session__Preview___Calendar
							setSession={setSession}
							session={session}
						/>
					</>}

				</div>
				
				{mutate__session.isPending && <Spinner/>}

			</PopoverContent>
		</Popover>
	</>
}
