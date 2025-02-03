

import './scss/Analytics_Session.scss'

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Previous from '../../components/NavigationElements/Previous'
import ChartDoughnut from '../../components/Statistics/Chart_Doughnut'





export default function Analytics_Session({
	setError, 
}) {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { session_id } = useParams()

	const [ loading, setLoading ] = useState(false)

	const [ user, setUser ] = useState()
	const [ total, setTotal ] = useState()
	const [ counts, setCounts ] = useState()
	const [ list_players, setList_players ] = useState()
	const [ total_games_played, setTotal_games_played ] = useState(0)

	const [ games_played, setGames_played ] = useState(0)
	const [ isBorderVisible, setIsBorderVisible ] = useState(false)

	const [ statistics_view, setStatistics_view ] = useState('statistics_overall')
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

		if(!session_id) return navigate(-1, { replace: true })

		setLoading(true)

		axiosPrivate.get(`/analytics/session?session_id=${session_id}`).then(({ data }) => {


			setUser(data.User)
			setTotal(data.Total)
			setList_players(data.List_Players)
			setTotal_games_played(data.Total_Games_Played)


			const Counts = data.Counts
			setCounts(Counts)
			setList_years(Object.keys(Counts).map(year => +year))


		}).catch(err => {

			handle_error({
				err, 
				handle_404: () => navigate(-1, { replace: true })
			})

		}).finally(() => setLoading(false))

		// eslint-disable-next-line
	}, [])

	useEffect(() => {

		if(!counts) return

		if(statistics_view === 'statistics_overall') setGames_played(total_games_played)

		if(statistics_view === 'statistics_year') {
			if(!counts[statistics_view_year]) {
				setGames_played(0)
			} else {
				setGames_played(counts[statistics_view_year].Total)
			}			
		}

		if(statistics_view === 'statistics_month') {
			if(!counts[statistics_view_year] || !counts[statistics_view_year][statistics_view_month]) {
				setGames_played(0)
			} else {
				setGames_played(counts[statistics_view_year][statistics_view_month].Total)
			}	
		}

		// eslint-disable-next-line
	}, [
		counts, 
		statistics_view, 
		statistics_view_month, 
		statistics_view_year, 
	])





	return <>
		<div className='analytics_session'>

			<Previous onClick={() => navigate(-1)}/>



			<div className='analytics_session_show_border'>
				<input type='checkbox' checked={isBorderVisible} onChange={() => setIsBorderVisible(prev => !prev)}/>
				<span>Umrandung anzeigen</span>
			</div>

			<div className='analytics_session_select'>

				<select
					value={statistics_view}
					onChange={({ target }) => setStatistics_view(target.value)}
				>
					<option key={0} value='statistics_overall'>Gesamt</option>
					<option key={1} value='statistics_year'>Jahr</option>
					<option key={2} value='statistics_month'>Monat</option>
				</select>

				{statistics_view === 'statistics_month' && <>
					<select
						value={statistics_view_month}
						onChange={({ target }) => setStatistics_view_month(+target.value)}
					>
						{list_months.map((month, index_month) => <>
							<option key={month} value={index_month + 1}>{month}</option>
						</>)}
					</select>
				</>}

				{(statistics_view === 'statistics_year' || statistics_view === 'statistics_month') && <>
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



			<ChartDoughnut
				statistics_view={statistics_view}
				statistics_view_year={statistics_view_year}
				statistics_view_month={statistics_view_month}

				IsBorderVisible={isBorderVisible}

				List_Players={list_players}

				Total={total}
				Counts={counts}
			/>



			<div className=''>

				<div>
					<span>Spiele gespielt</span>
					<span>{games_played}</span>
				</div>

			</div>

		</div>
	</>
}
