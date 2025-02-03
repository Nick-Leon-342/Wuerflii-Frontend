

import './scss/Analytics.scss'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Accordion from '../../components/others/Accordion'
import ChartBar from '../../components/Statistics/Chart_Bar'
import Previous from '../../components/NavigationElements/Previous'





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

	const [ statistics_view, setStatistics_view ] = useState('statistics_years')
	const [ statistics_view_month, setStatistics_view_month ] = useState(new Date().getMonth() + 1)
	const [ statistics_view_year, setStatistics_view_year ] = useState(new Date().getFullYear())

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



			<div className='analytics_select'>

				<select
					value={statistics_view}
					onChange={({ target }) => setStatistics_view(target.value)}
				>
					<option key={0} value='statistics_years'>Gesamt</option>
					<option key={1} value='statistics_months_of_year'>Jahr</option>
					<option key={2} value='statistics_days_of_month'>Monat</option>
				</select>

				{statistics_view === 'statistics_days_of_month' && <>
					<select
						value={statistics_view_month}
						onChange={({ target }) => setStatistics_view_month(+target.value)}
					>
						{list_months.map((month, index_month) => <>
							<option key={month} value={index_month + 1}>{month}</option>
						</>)}
					</select>
				</>}

				{(statistics_view === 'statistics_months_of_year' || statistics_view === 'statistics_days_of_month') && <>
					<select
						value={statistics_view_year}
						onChange={({ target }) => setStatistics_view_year(+target.value)}
					>
						{list_years.map(year => <>
							<option key={year} value={year}>{year}</option>
						</>)}
					</select>
				</>}

			</div>

			<ChartBar
				Counts={counts}
				list_months={list_months}

				statistics_view={statistics_view}
				statistics_view_month={statistics_view_month}
				statistics_view_year={statistics_view_year}
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



				<div className='analytics_statistics'>

					<h2>Statistiken angucken</h2>

					<div className=''>

						<button
							className='button'
						>Spieler</button>

						<button
							className='button'
						>Partien</button>

					</div>

				</div>

			</Accordion>

		</div>
	</>
}
