

import './scss/Statistics_Select_View.scss'

import { useEffect, useState } from 'react'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import LoaderBox from '../Loader/Loader_Box'





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
 *   setSession={setSession}
 *   session={session}
 *   setUser={setUser}
 *   user={user}
 *   isSession={true}
 * />
 *
 * @param {Object} props - The component props
 * @param {Array} props.list_months - List of month names for selecting a month in the 'statistics_month' view
 * @param {Array} props.list_years - List of years for selecting a year in the 'statistics_year' or 'statistics_month' view
 * @param {Function} props.setSession - Function to update session data
 * @param {Object} props.session - Current session data containing the statistics view settings
 * @param {Function} props.setUser - Function to update user data
 * @param {Object} props.user - Current user data containing the statistics view settings
 * @param {boolean} props.isSession - Flag to indicate if the data belongs to a session or a user
 *
 * @returns {JSX.Element} The rendered select view component for choosing statistics display options
 * 
 */

export default function Statistics_Select_View({
	list_months, 
	list_years, 

	setSession, 
	session, 

	setUser, 
	user, 

	isSession, 
}) {

	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ loading_view, setLoading_view ] = useState(false)

	const [ view, setView ] = useState()
	const [ view_month, setView_month ] = useState()
	const [ view_year, setView_year ] = useState()





	useEffect(() => {

		if(!session && !user) return

		const tmp = isSession ? session : user

		setView(tmp.Statistics_View)
		setView_month(tmp.Statistics_View_Month)
		setView_year(tmp.Statistics_View_Year)

	}, [ isSession, session, user ])

	const sync_view = ( view, view_month, view_year ) => {

		setLoading_view(true)

		axiosPrivate.patch(isSession ? '/session': '/user', {
			SessionID: session?.id, 
			Statistics_View: view, 
			Statistics_View_Month: view_month, 
			Statistics_View_Year: view_year, 
		}).then(() => {

			const tmp = isSession ? { ...session } : { ...user }
			
			tmp.Statistics_View = view
			tmp.Statistics_View_Month = view_month
			tmp.Statistics_View_Year = view_year

			if(isSession) {
				setSession(tmp)
			} else {
				setUser(tmp)
			}

		}).catch(err => {

			handle_error({
				err, 
			})

		}).finally(() => setLoading_view(false))

	}





	return <>
		<div className='statistics_select_view'>

			{loading_view && <>
				<LoaderBox
					dark={true}
					className='statistics_select_view-loader'
				/>
			</>}

			{!loading_view && <>

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
