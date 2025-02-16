

import './scss/Analytics.scss'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Accordion from '../../components/others/Accordion'
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

	const [ counts, setCounts ] = useState()
	const [ total_sessions, setTotal_sessions ] = useState(0)
	const [ total_games_played, setTotal_games_played ] = useState(0)

	const [ loading, setLoading ] = useState(false)
	const [ loading_sync, setLoading_sync ] = useState(false)

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
			setTotal_sessions(data.Total_Sessions)
			setTotal_games_played(data.Total_Games_Played)


			const Counts = data.Counts
			setCounts(Counts)
			setList_years(Object.keys(Counts).map(year => +year))


		}).catch(err => 

			handle_error({
				err, 
			})

		).finally(() => setLoading(false))

		// eslint-disable-next-line
	}, [])





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
					Counts={counts}
					list_months={list_months}

					statistics_view={user?.Statistics_View}
					statistics_view_month={user?.Statistics_View_Month}
					statistics_view_year={user?.Statistics_View_Year}
				/>



				<Accordion 
					title='Weitere Statistiken'
					className='analytics_accordion'
				>
					<div className='analytics_sessions'>
						
						<div>
							<span>Anzahl unterschiedlicher Partien:</span>
							<span>{total_sessions}</span>
						</div>
						
						<div>
							<span>Anzahl von Spielen gespielt gesamt:</span>
							<span>{total_games_played}</span>
						</div>

					</div>
				</Accordion>

			</>}

		</div>
	</>
}
