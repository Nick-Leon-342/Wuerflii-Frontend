

import './scss/Analytics.scss'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import LoaderDots from '../../components/Loader/Loader_Dots'
import ChartBar from '../../components/Statistics/Chart_Bar'
import Previous from '../../components/NavigationElements/Previous'
import StatisticsSelectView from '../../components/Statistics/Statistics_Select_View'





export default function Analytics({
	setError
}) {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ user, setUser ] = useState()

	const [ total, setTotal ] = useState()

	const [ loading, setLoading ] = useState(false)

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





	useEffect(() => {

		setLoading(true)

		axiosPrivate.get('/analytics').then(({ data }) => {

			
			setUser(data.User)
			setTotal(data.Total)
			setList_years(data.List_Years)


		}).catch(err => 

			handle_error({
				err, 
			})

		).finally(() => setLoading(false))

		// eslint-disable-next-line
	}, [
		user?.Statistics_View, 
		user?.Statistics_View_Month, 
		user?.Statistics_View_Year, 
	])





	return <>
		<div className='analytics'>

			<Previous onClick={() => navigate(-1)}/>

			{/* __________ Loading animation __________ */}
			{loading && <div className='analytics_loader'><LoaderDots/></div>}



			{!loading && <>

				<StatisticsSelectView
					list_years={list_years}
					list_months={list_months}

					setUser={setUser}
					user={user}

					isSession={false}
				/>



				<ChartBar
					labels={user?.Statistics_View === 'statistics_year' ? list_months : total?.Data ? Object.keys(total?.Data) : []}
					JSON={total?.Data}
				/>



				<div className='analytics_more-statistics'>
					
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

			</>}

		</div>
	</>
}
