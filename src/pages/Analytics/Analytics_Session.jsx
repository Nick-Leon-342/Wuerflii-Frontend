

import './scss/Analytics_Session.scss'

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Accordion from '../../components/others/Accordion'
import LoaderBox from '../../components/Loader/Loader_Box'
import PopupOptions from '../../components/Popup/Popup_Options'
import ChartGraph from '../../components/Statistics/Chart_Graph'
import Previous from '../../components/NavigationElements/Previous'
import ChartDoughnut from '../../components/Statistics/Chart_Doughnut'
import ChartBarSession from '../../components/Statistics/Chart_Bar_Session'





export default function Analytics_Session({
	setError, 
}) {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { session_id } = useParams()

	const [ loading, setLoading ] = useState(false)
	const [ loading_view, setLoading_view ] = useState(false)
	const [ loading_show_border, setLoading_show_border ] = useState(false)

	const [ user, setUser ] = useState()
	const [ total, setTotal ] = useState()
	const [ session, setSession ] = useState()
	const [ list_players, setList_players ] = useState()

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


			setTotal(data.Total)
			setUser(data.User)
			setSession(data.Session)
			setList_players(data.List_Players)
			setList_years(data.List_Years)
			

		}).catch(err => {

			handle_error({
				err, 
				handle_404: () => navigate(-1, { replace: true })
			})

		}).finally(() => setLoading(false))

		// eslint-disable-next-line
	}, [
		session?.Statistics_View, 
		session?.Statistics_View_Month, 
		session?.Statistics_View_Year, 
	])

	const sync_show_border = () => {

		setLoading_show_border(true)

		axiosPrivate.patch('/session', {
			SessionID: +session_id, 
			Statistics_Show_Border: !session.Statistics_Show_Border, 
		}).then(() => {


			setSession(prev => {
				const tmp = { ...prev }
				tmp.Statistics_Show_Border = !tmp.Statistics_Show_Border
				return tmp
			})


		}).catch(err => {

			handle_error({
				err, 
			})

		}).finally(() => setLoading_show_border(false))

	}

	const sync_view = ( view, view_month, view_year ) => {

		setLoading_view(true)

		axiosPrivate.patch('/session', {
			SessionID: +session_id, 
			Statistics_View: view, 
			Statistics_View_Month: view_month, 
			Statistics_View_Year: view_year, 
		}).then(() => {

			setSession(prev => {
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

		}).finally(() => setLoading_view(false))

	}





	return <>

		<PopupOptions 
			user={user}
			setUser={setUser}
		/>



		<div className='analytics_session'>

			<Previous onClick={() => navigate(-1)}/>





			{/* __________________________________________________ Charts __________________________________________________ */}

			<div className='analytics_session_charts'>



				{/* ____________________ Select ____________________ */}

				<div className='analytics_session_select'>

					{loading_view && <>
						<LoaderBox
							dark={true}
							className='analytics_session_select-loader'
						/>
					</>}

					{!loading_view && <>

						<select
							value={session?.Statistics_View}
							onChange={({ target }) => sync_view(target.value, session.Statistics_View_Month, session.Statistics_View_Year)}
						>
							<option key={0} value='statistics_overall'>Gesamt</option>
							<option key={1} value='statistics_year'>Jahr</option>
							<option key={2} value='statistics_month'>Monat</option>
						</select>

						{session?.Statistics_View === 'statistics_month' && <>
							<select
								value={session.Statistics_View_Month}
								onChange={({ target }) => sync_view(session.Statistics_View, +target.value, session.Statistics_View_Year)}
							>
								{list_months.map((month, index_month) => <>
									<option key={month} value={index_month + 1}>{month}</option>
								</>)}
							</select>
						</>}

						{(session?.Statistics_View === 'statistics_year' || session?.Statistics_View === 'statistics_month') && <>
							<select
								value={session.Statistics_View_Year}
								onChange={({ target }) => sync_view(session.Statistics_View, session.Statistics_View_Month, +target.value)}
							>
								{list_years.map(year => <>
									<option key={year} value={year}>{year}</option>
								</>)}
							</select>
						</>}
					
					</>}

				</div>



				{/* ____________________ Doughnut ____________________ */}

				<ChartDoughnut
					List_Players={list_players}
					Total_Wins={total?.Total_Wins} 
					IsBorderVisible={session?.Statistics_Show_Border}
				/>



				{/* ____________________ Show border ____________________ */}

				<div className='analytics_session_show_border'>
					{loading_show_border && <>
						<LoaderBox
							dark={true}
							className='analytics_session_show_border-loader'
						/>
					</>}
					{!loading_show_border && <>
						<input 
							type='checkbox' 
							checked={session?.Statistics_Show_Border} 
							onChange={sync_show_border}
						/>
					</>}
					<span>Umrandung anzeigen</span>
				</div>



				{/* ____________________ Graph ____________________ */}

				<h2>Verlauf</h2>

				<ChartGraph
					labels={session?.Statistics_View === 'statistics_year' ? [ 0, ...list_months ] : total?.Data ? Object.keys(total?.Data) : []}
					IsBorderVisible={session?.Statistics_Show_Border}
					List_Players={list_players}
					Data={total?.Data}
				/>

			</div>





			{/* __________________________________________________ More statistics __________________________________________________ */}

			{total && <>
				<div className='analytics_session_more-statistics'>
					
					<h2>Mehr Statistiken</h2>

					<div className='statistic'>
						<span>Spiele gespielt</span>
						<span>{total.Total_Games_Played}</span>
					</div>

					<div className='statistic'>
						<span>Davon unentschieden</span>
						<span>{total.Total_Draws}</span>
					</div>



					<div className='chart-container'>

						<span>Niedriste Punktzahlen:</span>

						<ChartBarSession
							IsBorderVisible={session?.Statistics_Show_Border}
							List_Players={list_players}
							JSON={total.Scores_Lowest}
						/>

					</div>



					<div className='chart-container'>

						<span>Höchste Punktzahlen:</span>

						<ChartBarSession
							IsBorderVisible={session?.Statistics_Show_Border}
							List_Players={list_players}
							JSON={total.Scores_Highest}
						/>
						
					</div>



					<div className='chart-container'>

						<span>⌀ Durschnittliche Punktzahlen:</span>

						<ChartBarSession
							IsBorderVisible={session?.Statistics_Show_Border}
							List_Players={list_players}
							JSON={total.Scores_Average}
						/>

					</div>

				</div>
			</>}

		</div>
	</>
}
