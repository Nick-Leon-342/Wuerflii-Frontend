

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
	const [ draws, setDraws ] = useState()
	const [ total, setTotal ] = useState()
	const [ counts, setCounts ] = useState()
	const [ session, setSession ] = useState()
	const [ list_players, setList_players ] = useState()
	const [ total_games_played, setTotal_games_played ] = useState(0)

	const [ games_played, setGames_played ] = useState(0)

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
			setDraws(data.Draws)
			setTotal(data.Total)
			setSession(data.Session)
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

		if(!counts || !session) return

		const view = session.Statistics_View
		const view_month = session?.Statistics_View_Month
		const view_year = session?.Statistics_View_Year

		if(view === 'statistics_overall') setGames_played(total_games_played)

		if(view === 'statistics_year') {
			if(!counts[view_year]) {
				setGames_played(0)
			} else {
				setGames_played(counts[view_year].Total)
			}			
		}

		if(view === 'statistics_month') {
			if(!counts[view_year] || !counts[view_year][view_month]) {
				setGames_played(0)
			} else {
				setGames_played(counts[view_year][view_month].Total)
			}	
		}

		// eslint-disable-next-line
	}, [
		counts, 
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



			{/* __________________________________________________ Select __________________________________________________ */}

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



			{/* __________________________________________________ More statistics __________________________________________________ */}

			<Accordion 
				title='Weitere Statistiken'
				className='analytics_session_accordion'
			>
				<div className='analytics_session_accordion-container'>
					
					<div>
						<span>Spiele gespielt</span>
						<span>{games_played}</span>
					</div>

					<div>
						<span>Davon unentschieden</span>
						<span>{draws}</span>
					</div>

				</div>
			</Accordion>



			{/* __________________________________________________ Charts __________________________________________________ */}

			<ChartDoughnut
				statistics_view={session?.Statistics_View}
				statistics_view_year={session?.Statistics_View_Year}
				statistics_view_month={session?.Statistics_View_Month}

				IsBorderVisible={session?.Statistics_Show_Border}

				List_Players={list_players}

				Total={total}
				Counts={counts}
			/>

			<ChartGraph
				statistics_view={session?.Statistics_View}
				statistics_view_year={session?.Statistics_View_Year}
				statistics_view_month={session?.Statistics_View_Month}

				IsBorderVisible={session?.Statistics_Show_Border}
				List_Players={list_players}
				List_Months={list_months}
				Counts={counts}
			/>

		</div>
	</>
}
