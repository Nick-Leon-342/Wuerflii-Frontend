

import './scss/Analytics_Session.scss'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import LoaderBox from '../../components/Loader/Loader_Box'
import LoaderDots from '../../components/Loader/Loader_Dots'
import PopupOptions from '../../components/Popup/Popup__Options'
import ChartGraph from '../../components/Statistics/Chart_Graph'
import Previous from '../../components/NavigationElements/Previous'
import ChartDoughnut from '../../components/Statistics/Chart_Doughnut'
import ChartBarSession from '../../components/Statistics/Chart_Bar_Session'
import StatisticsSelectView from '../../components/Statistics/Statistics_Select_View'

import { get__user } from '../../api/user'
import { get__session } from '../../api/session/session'
import { get__session_players } from '../../api/session/session_players'
import { get__analytics_session } from '../../api/analytics'





export default function Analytics_Session() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { session_id } = useParams()

	const [ loading_show_border, setLoading_show_border ] = useState(false)

	const [ total, setTotal ] = useState()
	const [ session, setSession ] = useState()

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


	// ____________________ Session ____________________

	const { data: tmp__session, isLoading: isLoading__session, error: error__session } = useQuery({
		queryFn: () => get__session(axiosPrivate, session_id), 
		queryKey: [ 'session', +session_id ], 
	})

	if(error__session) {
		handle_error({
			err: error__session, 
			handle_404: () => {
				alert('Die Partie wurde nicht gefunden.')
				navigate('/', { replace: true })
			}
		})
	}

	useEffect(() => { if(tmp__session) setSession(tmp__session) }, [ tmp__session ])
	

	// ____________________ List_Players ____________________

	const { data: list_players, isLoading: isLoading__list_players, error: error__list_players } = useQuery({
		queryFn: () => get__session_players(axiosPrivate, session_id), 
		queryKey: [ 'session', +session_id, 'players' ], 
	})

	if(error__list_players) {
		handle_error({
			err: error__list_players, 
			handle_404: () => {
				alert('Die Partie wurde nicht gefunden.')
				navigate('/', { replace: true })
			}
		})
	}


	// ____________________ Analytics ____________________

	const { data: analytics, isLoading: isLoading__analytics, error: error__analytics, refetch } = useQuery({
		queryFn: () => get__analytics_session(axiosPrivate, session_id), 
		queryKey: [ 'session', +session_id, 'analytics' ], 
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

		if(!session_id) return navigate(-1, { replace: true })

		refetch()

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





	return <>

		<PopupOptions user={user}/>



		<div className='analytics_session'>

			<Previous onClick={() => navigate(-1)}/>

			{/* __________ Loading animation __________ */}
			{(isLoading__user || isLoading__session || isLoading__analytics || isLoading__list_players) && <div className='analytics_session-loader'><LoaderDots/></div>}




			{/* __________________________________________________ Charts __________________________________________________ */}

			<div className='analytics_session_charts box'>



				{/* ____________________ Select ____________________ */}

				<StatisticsSelectView
					list_months={list_months}
					list_years={list_years}

					setSession={setSession}
					session={session}

					isSession={true}
				/>



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
							checked={session?.Statistics_Show_Border || false} 
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
				<div className='analytics_session_more-statistics box'>
					
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
