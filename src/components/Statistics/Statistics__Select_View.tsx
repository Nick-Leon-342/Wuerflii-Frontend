

import './scss/Statistics__Select_View.scss'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import useErrorHandling from '../../hooks/useErrorHandling'

import { patch__session } from '../../api/session/session'
import { patch__user } from '../../api/user'

import { List__Months_Enum, type Enum__Month } from '../../types/Enum/Enum__Month'
import { Type__List_Months } from '../../types/Type__List_Months'

import type { Type__Client_To_Server__Session__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session__PATCH'
import type { Type__Client_To_Server__User__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__User__PATCH'
import type { Enum__Statistics_View } from '../../types/Enum/Enum__Statistics_View'
import type { Type__Session } from '../../types/Type__Session'
import type { Type__User } from '../../types/Type__User'

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

	const [ view, 		setView 		] = useState<Enum__Statistics_View>('STATISTICS_OVERALL')
	const [ view_month, setView_month 	] = useState<Enum__Month>('JANUARY')
	const [ view_year, 	setView_year 	] = useState<number>(2026)

	const list__view: Array<Enum__Statistics_View> = [
		'STATISTICS_OVERALL', 
		'STATISTICS_YEAR', 
		'STATISTICS_MONTH', 
	]





	const mutate__user = useMutation({
		mutationFn: (json: Type__Client_To_Server__User__PATCH) => patch__user(json), 
		onSuccess: (_, json) => {
			query_client.setQueryData([ 'user' ], (prev: Type__User) => {
				const tmp = { ...prev }
				tmp.Statistics__View 		= json.Statistics__View			|| 'STATISTICS_OVERALL'
				tmp.Statistics__View_Month 	= json.Statistics__View_Month	|| 'JANUARY'
				tmp.Statistics__View_Year 	= json.Statistics__View_Year	|| 2026
				return tmp
			})
		}, 
		onError: err => {
			handle_error({
				err, 
			})
		}
	})

	const mutate__session = useMutation({
		mutationFn: (json: Type__Client_To_Server__Session__PATCH) => patch__session(json), 
		onSuccess: (_, json) => {
			query_client.setQueryData([ 'session', json.SessionID ], (prev: Type__Session) => {
				if(!prev) return prev
				const tmp = { ...prev }
				tmp.Statistics__View 		= json.Statistics__View			|| 'STATISTICS_OVERALL'
				tmp.Statistics__View_Month 	= json.Statistics__View_Month	|| 'JANUARY'
				tmp.Statistics__View_Year 	= json.Statistics__View_Year	|| 2026
				return tmp
			})
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
		view: 		Enum__Statistics_View, 
		view_month:	Enum__Month, 
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
						onValueChange={value => sync_view(value as Enum__Statistics_View, view_month, view_year)}
						disabled={disabled}
						value={view}
					>
						<SelectTrigger>
							<SelectValue/>
						</SelectTrigger>

						<SelectContent>
							<SelectGroup>
								{list__view.map(view => (
									<SelectItem
										key={view}
										value={view}
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
											value={year.toString()}
										>{year}</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</>}

					{view === 'STATISTICS_MONTH' && <>
						<Select
							onValueChange={value => sync_view(view, value as Enum__Month, view_year)}
							disabled={disabled}
							value={view_month}
						>
							<SelectTrigger>
								<SelectValue/>
							</SelectTrigger>

							<SelectContent>
								<SelectGroup>
									{Type__List_Months.map((month, index_month) => (
										<SelectItem
											key={month}
											value={List__Months_Enum[index_month]}
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
