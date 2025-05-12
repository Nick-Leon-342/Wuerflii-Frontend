

import './scss/Analytics.scss'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import LoaderDots from '../../components/Loader/Loader_Dots'
import ChartBar from '../../components/Statistics/Chart_Bar'
import PopupOptions from '../../components/Popup/Popup_Options'
import Previous from '../../components/NavigationElements/Previous'
import StatisticsSelectView from '../../components/Statistics/Statistics_Select_View'

import { get__user } from '../../api/user'
import { get__analytics } from '../../api/analytics'





export default function Analytics() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()
	
	const [ total, setTotal ] = useState()
	const [ list_years, setList_years ] = useState([])
	const list_months = [
		'Januar', 
		'Februar', 
		'März', 
		'April', 
		'Mai', 
		'Juni', 
		'Juli', 
		'August', 
		'September', 
		'Oktober', 
		'November', 
		'Dezember', 
	]


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


	// ____________________ Analytics ____________________

	const { data: analytics, isLoading: isLoading__analytics, error: error__analytics, refetch } = useQuery({
		queryFn: () => get__analytics(axiosPrivate), 
		queryKey: [ 'analytics' ], 
	})

	if(error__analytics) {
		handle_error({
			err: error__analytics, 
		})
	}

	useEffect(() => {
		if(!analytics) return
		setTotal(analytics.Total)
		setList_years(analytics.List_Years)
	}, [ analytics ])





	useEffect(() => {

		refetch()

		// eslint-disable-next-line
	}, [
		user?.Statistics_View, 
		user?.Statistics_View_Month, 
		user?.Statistics_View_Year, 
	])





	return <>

		<PopupOptions user={user}/>





		<div className='analytics'>

			<Previous onClick={() => navigate(-1)}/>



			{/* __________ Loading animation __________ */}
			{(isLoading__user || isLoading__analytics) && <div className='analytics_loader'><LoaderDots/></div>}



			<StatisticsSelectView
				list_years={list_years}
				list_months={list_months}

				user={user}

				isSession={false}
			/>



			<ChartBar
				labels={user?.Statistics_View === 'statistics_year' ? list_months : total?.Data ? Object.keys(total?.Data) : []}
				JSON={total?.Data}
			/>



			<div className='analytics_more-statistics box'>
				
				{user?.Statistics_View === 'statistics_overall' && <>
					<div>
						<span>Anzahl unterschiedlicher Partien:</span>
						<span>{total?.Total_Sessions}</span>
					</div>
				</>}
				
				<div>
					<span>Anzahl von Spielen:</span>
					<span>{total?.Total_Games_Played}</span>
				</div>

			</div>

		</div>
	</>
}
