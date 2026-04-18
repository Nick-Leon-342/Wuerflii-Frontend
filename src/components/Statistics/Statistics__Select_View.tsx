

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import type { Type__Session, Type__Session_PATCH } from '../../types/Zod__Session'
import { Enum__Statistics_View } from '../../types/Enum/Enum__Statistics_View'
import type { Type__User, Type__User_PATCH } from '@/types/Zod__User'
import useErrorHandling from '../../hooks/useErrorHandling'
import { patch__session } from '../../api/session/session'
import { Enum__Months } from '@/types/Enum/Enum__Months'
import { patch__user } from '../../api/user'

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '../ui/popover'
import { ChartNoAxesColumn } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'





interface Props__Statistics__Select_View {
	list__years:	Array<number>
	session?:		Type__Session
	user?:			Type__User
	isSession:		boolean
}

export default function Statistics__Select_View({
	list__years, 
	session, 
	user, 
	isSession, 
}: Props__Statistics__Select_View) {

	const navigate		= useNavigate()
	const { t }			= useTranslation()
	const query_client 	= useQueryClient()
	const handle_error 	= useErrorHandling()

	const [ view, 		setView 		] = useState<typeof Enum__Statistics_View[number]>('STATISTICS_OVERALL')
	const [ view_month, setView_month 	] = useState<typeof Enum__Months[number]>('JANUARY')
	const [ view_year, 	setView_year 	] = useState<number>(2026)





	const mutate__user = useMutation({
		mutationFn: (json: Type__User_PATCH) => patch__user(json), 
		onSuccess: (_, json) => {
			query_client.setQueryData([ 'user' ], (prev: Type__User) => {
				const tmp = { ...prev }
				tmp.Statistics__View 		= json.Statistics__View			|| 'STATISTICS_OVERALL'
				tmp.Statistics__View_Month 	= json.Statistics__View_Month	|| 'JANUARY'
				tmp.Statistics__View_Year 	= json.Statistics__View_Year	|| 2026
				return tmp
			})

			query_client.invalidateQueries({ queryKey: [ 'analytics' ]})
		}, 
		onError: err => {
			handle_error({
				err, 
			})
		}
	})

	const mutate__session = useMutation({
		mutationFn: (json: Type__Session_PATCH) => patch__session(+(session?.id || -1), json), 
		onSuccess: (_, json) => {
			query_client.setQueryData([ 'session', session?.id ], (prev: Type__Session) => {
				if(!prev) return prev
				const tmp = { ...prev }
				tmp.Statistics__View 		= json.Statistics__View			|| 'STATISTICS_OVERALL'
				tmp.Statistics__View_Month 	= json.Statistics__View_Month	|| 'JANUARY'
				tmp.Statistics__View_Year 	= json.Statistics__View_Year	|| 2026
				return tmp
			})

			query_client.invalidateQueries({ queryKey: [ 'session', +(session?.id || -1), 'analytics' ]})
		}, 
		onError: err => {
			handle_error({
				err, 
				handle_404: () => {
					toast.error(t('session_not_found'))
					navigate('/', { replace: true })
				}
			})
		}
	})





	useEffect(() => {
		function init() {
			const tmp = isSession ? session : user
			if(!tmp) return	
	
			setView(tmp.Statistics__View)
			setView_month(tmp.Statistics__View_Month)
			setView_year(tmp.Statistics__View_Year)
		}
		init()
	}, [ isSession, session, user ])

	const sync_view = ( 
		view: 		(typeof Enum__Statistics_View)[number], 
		view_month:	(typeof Enum__Months)[number], 
		view_year:	number, 
	) => {

		if(isSession && !session) return

		const json = {
			SessionID: 				session?.id || -1, 
			Statistics__View: 		view, 
			Statistics__View_Month: view_month, 
			Statistics__View_Year: 	view_year, 
		}

		if(isSession) {
			mutate__session.mutate(json)
		} else {
			mutate__user.mutate(json)
		}

	}

	const disabled = mutate__session.isPending || mutate__user.isPending





	return <>
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					className='w-10 h-10'
				><ChartNoAxesColumn className='w-8! h-8!'/></Button>
			</PopoverTrigger>



			<PopoverContent align='end'>
				<PopoverHeader>
					<PopoverTitle></PopoverTitle>
				</PopoverHeader>

				<div className='flex flex-col gap-4'>

					<Select
						onValueChange={value => sync_view(value as (typeof Enum__Statistics_View)[number], view_month, view_year)}
						disabled={disabled}
						value={view}
					>
						<SelectTrigger>
							<SelectValue/>
						</SelectTrigger>

						<SelectContent>
							<SelectGroup>
								{Enum__Statistics_View.map(view => (
									<SelectItem
										key={view}
										value={view}
										className='text-lg'
									>{t('statistics_view.' + view)}</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>

					{(view === 'STATISTICS_YEAR' || view === 'STATISTICS_MONTH') && <>
						<Select
							onValueChange={value => sync_view(view, view_month, +value)}
							value={view_year.toString()}
							disabled={disabled}
						>
							<SelectTrigger>
								<SelectValue/>
							</SelectTrigger>

							<SelectContent>
								<SelectGroup>
									{list__years.map(year => (
										<SelectItem
											key={year}
											className='text-lg'
											value={year.toString()}
										>{year}</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</>}

					{view === 'STATISTICS_MONTH' && <>
						<Select
							onValueChange={value => sync_view(view, value as (typeof Enum__Months)[number], view_year)}
							disabled={disabled}
							value={view_month}
						>
							<SelectTrigger>
								<SelectValue/>
							</SelectTrigger>

							<SelectContent>
								<SelectGroup>
									{Enum__Months.map(month => (
										<SelectItem
											key={month}
											value={month}
											className='text-lg'
										>{t('months.' + month)}</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</>}

				</div>
			</PopoverContent>
		</Popover>
	</>
}
