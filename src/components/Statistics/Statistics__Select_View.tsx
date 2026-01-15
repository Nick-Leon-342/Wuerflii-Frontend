

import './scss/Statistics__Select_View.scss'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import LoaderBox from '../Loader/Loader_Box'

import { patch__user } from '../../api/user'
import { patch__session } from '../../api/session/session'

import type { Type__User } from '../../types/Type__User'
import type { Type__Session } from '../../types/Type__Session'
import { Type__List_Months } from '../../types/Type__List_Months'
import type { Type__Enum__Month } from '../../types/Type__Enum/Type__Enum__Month'
import type { Type__Enum__Statistics_View } from '../../types/Type__Enum/Type__Enum__Statistics_View'
import type { Type__Client_To_Server__User__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__User__PATCH'
import type { Type__Client_To_Server__Session__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session__PATCH'





interface Props__Statistics__Select_View {
	list_years:		Array<number>
	session?:		Type__Session
	user?:			Type__User
	isSession:		boolean
}

export default function Statistics__Select_View({
	list_years, 
	session, 
	user, 
	isSession, 
}: Props__Statistics__Select_View) {

	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ view, 		setView 		] = useState<Type__Enum__Statistics_View>('statistics_overall')
	const [ view_month, setView_month 	] = useState<Type__Enum__Month>(1)
	const [ view_year, 	setView_year 	] = useState<number>(2026)

	const mutate__user = useMutation({
		mutationFn: (json: Type__Client_To_Server__User__PATCH) => patch__user(axiosPrivate, json), 
		onSuccess: (_, json) => {
			query_client.setQueryData([ 'user' ], (prev: Type__User) => {
				const tmp = { ...prev }
				tmp.Statistics_View 		= json.Statistics_View || 'statistics_overall'
				tmp.Statistics_View_Month 	= json.Statistics_View_Month || 1
				tmp.Statistics_View_Year 	= json.Statistics_View_Year || 2026
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
		mutationFn: (json: Type__Client_To_Server__Session__PATCH) => patch__session(axiosPrivate, json), 
		onSuccess: (_, json) => {
			query_client.setQueryData([ 'session', json.SessionID ], (prev: Type__Session) => {
				if(!prev) return prev
				const tmp = { ...prev }
				tmp.Statistics_View 		= json.Statistics_View || 'statistics_overall'
				tmp.Statistics_View_Month 	= json.Statistics_View_Month || 1
				tmp.Statistics_View_Year 	= json.Statistics_View_Year || 2026
				return tmp
			})
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





	useEffect(() => {
		function init() {
			const tmp = isSession ? session : user
			if(!tmp) return	
	
			setView(tmp.Statistics_View)
			setView_month(tmp.Statistics_View_Month)
			setView_year(tmp.Statistics_View_Year)
		}
		init()
	}, [ isSession, session, user ])

	const sync_view = ( 
		view: 		Type__Enum__Statistics_View, 
		view_month:	Type__Enum__Month, 
		view_year:	number, 
	) => {

		if(isSession && !session) return

		const json = {
			SessionID: session?.id || -1, 
			Statistics_View: view, 
			Statistics_View_Month: view_month, 
			Statistics_View_Year: view_year, 
		}

		if(isSession) {
			mutate__session.mutate(json)
		} else {
			mutate__user.mutate(json)
		}

	}





	return <>
		<div className='statistics__select_view'>

			{(mutate__session.isPending || mutate__user.isPending) && <>
				<LoaderBox
					dark={true}
					className='statistics__select_view--loader'
				/>
			</>}

			{!mutate__session.isPending && !mutate__user.isPending && <>

				<select
					value={view}
					onChange={({ target }) => sync_view(target.value as Type__Enum__Statistics_View, view_month, view_year)}
				>
					<option key={0} value='statistics_overall'>Gesamt</option>
					<option key={1} value='statistics_year'>Jahr</option>
					<option key={2} value='statistics_month'>Monat</option>
				</select>

				{view === 'statistics_month' && <>
					<select
						value={view_month}
						onChange={({ target }) => sync_view(view, +target.value as Type__Enum__Month, view_year)}
					>
						{Type__List_Months.map((month, index_month) => <>
							<option key={month} value={index_month + 1}>{month}</option>
						</>)}
					</select>
				</>}

				{(view === 'statistics_year' || view === 'statistics_month') && <>
					<select
						value={view_year}
						onChange={({ target }) => sync_view(view, view_month, +target.value)}
					>
						{list_years.map(year => <option key={year} value={year}>{year}</option>)}
					</select>
				</>}
			
			</>}

		</div>
	</>
}
