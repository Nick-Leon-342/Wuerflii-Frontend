

import './scss/Analytics.scss'

import { useContext, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import useErrorHandling from '../../hooks/useErrorHandling'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import Statistics__Select_View from '../../components/Statistics/Statistics__Select_View'
import Previous from '../../components/NavigationElements/Previous'
import PopupOptions from '../../components/Popup/Popup__Options'
import Chart_Bar from '../../components/Statistics/Chart_Bar'

import Context__Universal_Loader from '../../Provider_And_Context/Provider_And_Context__Universal_Loader'
import { Type__List_Months } from '../../types/Type__List_Months'
import { get__analytics } from '../../api/analytics'
import { get__user } from '../../api/user'

import type { Type__Server_Response__Analytics__GET__Total } from '../../types/Type__Server_Response/Type__Server_Response__Analytics__GET'





export default function Analytics() {

	const navigate = useNavigate()
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { setLoading__universal_loader } = useContext(Context__Universal_Loader)
	
	const [ total, 		setTotal		] = useState<Type__Server_Response__Analytics__GET__Total>()
	const [ list_years, setList_years	] = useState<Array<number>>([])


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
		function init() {
			if(!analytics) return
			setTotal(analytics.Total)
			setList_years(analytics.List__Years)
		}
		init()
	}, [ analytics ])





	useEffect(() => {

		refetch()

		// eslint-disable-next-line
	}, [
		user?.Statistics__View, 
		user?.Statistics__View_Month, 
		user?.Statistics__View_Year, 
	])

	useEffect(() => { setLoading__universal_loader(isLoading__user || isLoading__analytics) }, [ isLoading__user, isLoading__analytics ])





	return <>

		<PopupOptions user={user}/>





		<div className='analytics'>

			<Previous onClick={() => navigate(-1)}/>



			{user && <>
				<Statistics__Select_View
					list__years={list_years}
					isSession={false}
					user={user}
				/>
			</>}



			{total && <>
				<Chart_Bar
					labels={user?.Statistics__View === 'STATISTICS_YEAR' ? Type__List_Months.map(month => t('months.' + month)) : total?.Data ? Object.keys(total?.Data) : []}
					data={total.Data}
				/>
			</>}



			<div className='analytics--more_statistics box'>
				
				{user?.Statistics__View === 'STATISTICS_OVERALL' && <>
					<div>
						<span>{t('amount_of_different_sessions')}:</span>
						<span>{total?.Total__Sessions}</span>
					</div>
				</>}
				
				<div>
					<span>{t('amount_of_games')}:</span>
					<span>{total?.Total__Games_Played}</span>
				</div>

			</div>

		</div>
	</>
}
