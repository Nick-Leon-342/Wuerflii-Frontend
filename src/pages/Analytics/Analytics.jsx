

import './scss/Analytics.scss'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Accordion from '../../components/others/Accordion'
import LoaderBox from '../../components/Loader/Loader_Box'
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

	const sync_view = ( view, view_month, view_year ) => {

		setLoading_sync(true)

		axiosPrivate.patch('/user', {
			Statistics_View: view,
			Statistics_View_Month: view_month, 
			Statistics_View_Year: view_year, 
		}).then(() => {

			setUser(prev => {
				const tmp = { ...prev }
				tmp.Statistics_View = view
				tmp.Statistics_View_Month = view_month
				tmp.Statistics_View_Year = view_year
				return tmp
			})

		}).catch(err => {

			handle_error({
				err, 
			})

		}).finally(() => setLoading_sync(false))

	}





	return <>
		<div className='analytics'>

			<Previous onClick={() => navigate(-1)}/>



			<div className='analytics_select'>

				{loading_sync && <>
					<LoaderBox
						dark={true}
						className='analytics_select-loader'
					/>
				</>}

				{!loading_sync && <>
					<select
						value={user?.Statistics_View}
						onChange={({ target }) => sync_view(target.value, user.Statistics_View_Month, user.Statistics_View_Year)}
					>
						<option key={0} value='statistics_years'>Gesamt</option>
						<option key={1} value='statistics_months_of_year'>Jahr</option>
						<option key={2} value='statistics_days_of_month'>Monat</option>
					</select>

					{user?.Statistics_View === 'statistics_days_of_month' && <>
						<select
							value={user?.Statistics_View_Month}
							onChange={({ target }) => sync_view(user.Statistics_View, +target.value, user.Statistics_View_Year)}
						>
							{list_months.map((month, index_month) => <>
								<option key={month} value={index_month + 1}>{month}</option>
							</>)}
						</select>
					</>}

					{(user?.Statistics_View === 'statistics_months_of_year' || user?.Statistics_View === 'statistics_days_of_month') && <>
						<select
							value={user?.Statistics_View_Year}
							onChange={({ target }) => sync_view(user.Statistics_View, user.statistics_view_month, +target.value)}
						>
							{list_years.map(year => <>
								<option key={year} value={year}>{year}</option>
							</>)}
						</select>
					</>}
				</>}

			</div>



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

		</div>
	</>
}
