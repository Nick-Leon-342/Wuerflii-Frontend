

import './scss/Statistics_Select_View.scss'

import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import LoaderBox from '../Loader/Loader_Box'

import { patch__user } from '../../api/user'
import { patch__session } from '../../api/session/session'





/**
 * 
 * Statistics_Select_View component allows the user to select a view for displaying statistics
 * (Overall, Yearly, or Monthly) and the corresponding month and year, updating the session or user data accordingly.
 * It handles the interaction with the backend for syncing the selected view settings.
 *
 * @component
 * @example
 * // Example usage of Statistics_Select_View component
 * <Statistics_Select_View
 *   list_months={['January', 'February', 'March']}
 *   list_years={[2022, 2023, 2024]}
 *   session={session}
 *   user={user}
 *   isSession={true}
 * />
 *
 * @param {Object} props - The component props
 * @param {Array} props.list_months - List of month names for selecting a month in the 'statistics_month' view
 * @param {Array} props.list_years - List of years for selecting a year in the 'statistics_year' or 'statistics_month' view
 * @param {Object} props.session - Current session data containing the statistics view settings
 * @param {Object} props.setUser - Function to set user data
 * @param {Object} props.user - Current user data containing the statistics view settings
 * @param {boolean} props.isSession - Flag to indicate if the data belongs to a session or a user
 *
 * @returns {JSX.Element} The rendered select view component for choosing statistics display options
 * 
 */

export default function Statistics_Select_View({
	list_months, 
	list_years, 

	session, 

	setUser, 
	user, 

	isSession, 
}) {

	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()

	const [ view, setView ] = useState()
	const [ view_month, setView_month ] = useState()
	const [ view_year, setView_year ] = useState()

	// useEffect(() => {

	// 	setView(user.View)
	// 	setView_month(user.View_Month)
	// 	setView_year(user.View_Year)

	// }, [ user ])

	const mutate__user = useMutation({
		mutationFn: json => patch__user(axiosPrivate, json), 
		onSuccess: (_, json) => {
			console.log(json)
			query_client.setQueryData([ 'user' ], prev => {
				const tmp = { ...prev }
				tmp.Statistics_View = json.Statistics_View
				tmp.Statistics_View_Month = json.Statistics_View_Month
				tmp.Statistics_View_Year = json.Statistics_View_Year
				return tmp
			})
		}
	})

	const mutate__session = useMutation({
		mutationFn: json => patch__session(axiosPrivate, json), 
		onSuccess: (_, json) => {
			query_client.setQueryData([ 'session', session.id ], prev => {
				const tmp = { ...prev }
				tmp.Statistics_View = json.Statistics_View
				tmp.Statistics_View_Month = json.Statistics_View_Month
				tmp.Statistics_View_Year = json.Statistics_View_Year
				return tmp
			})
		}
	})





	useEffect(() => {

		if(!session && !user) return

		const tmp = isSession ? session : user

		setView(tmp.Statistics_View)
		setView_month(tmp.Statistics_View_Month)
		setView_year(tmp.Statistics_View_Year)

	}, [ isSession, session, user ])

	const sync_view = ( view, view_month, view_year ) => {

		const json = {
			SessionID: session?.id, 
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
		<div className='statistics_select_view'>

			{(mutate__session.isPending || mutate__user.isPending) && <>
				<LoaderBox
					dark={true}
					className='statistics_select_view-loader'
				/>
			</>}

			{(!mutate__session.isPending || !mutate__user.isPending) && <>

				<select
					value={view}
					onChange={({ target }) => sync_view(target.value, view_month, view_year)}
				>
					<option key={0} value='statistics_overall'>Gesamt</option>
					<option key={1} value='statistics_year'>Jahr</option>
					<option key={2} value='statistics_month'>Monat</option>
				</select>

				{view === 'statistics_month' && <>
					<select
						value={view_month}
						onChange={({ target }) => sync_view(view, +target.value, view_year)}
					>
						{list_months.map((month, index_month) => <>
							<option key={month} value={index_month + 1}>{month}</option>
						</>)}
					</select>
				</>}

				{(view === 'statistics_year' || view === 'statistics_month') && <>
					<select
						value={view_year}
						onChange={({ target }) => sync_view(view, view_month, +target.value)}
					>
						{list_years.map(year => <>
							<option key={year} value={year}>{year}</option>
						</>)}
					</select>
				</>}
			
			</>}

		</div>
	</>
}
