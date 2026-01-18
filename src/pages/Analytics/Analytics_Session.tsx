

import './scss/Analytics_Session.scss'

import { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import LoaderBox from '../../components/Loader/Loader_Box'
import Chart_Graph from '../../components/Statistics/Chart_Graph'
import Popup__Options from '../../components/Popup/Popup__Options'
import Previous from '../../components/NavigationElements/Previous'
import ChartDoughnut from '../../components/Statistics/Chart_Doughnut'
import Chart_Bar_Session from '../../components/Statistics/Chart_Bar_Session'
import Statistics__Select_View from '../../components/Statistics/Statistics__Select_View'
import Context__Universal_Loader from '../../Provider_And_Context/Provider_And_Context__Universal_Loader'

import { get__user } from '../../api/user'
import { get__session, patch__session } from '../../api/session/session'
import { get__analytics_session } from '../../api/analytics'
import { get__session_players } from '../../api/session/session_players'

import type { Type__Session } from '../../types/Type__Session'
import type { Type__Client_To_Server__Session__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session__PATCH'
import type { Type__Server_Response__Analytics_Session__GET__Total } from '../../types/Type__Server_Response/Type__Server_Response__Analytics_Session__GET'
import { Type__List_Months } from '../../types/Type__List_Months'





export default function Analytics_Session() {

	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()
	const { setLoading__universal_loader } = useContext(Context__Universal_Loader)

	const { session_id } = useParams()

	const [ total,			setTotal		] = useState<Type__Server_Response__Analytics_Session__GET__Total>()
	const [ session,		setSession		] = useState<Type__Session>()

	const [ list__years, 	setList__years	] = useState<Array<number>>([])



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
		queryFn: () => get__session(axiosPrivate, +(session_id || -1)), 
		queryKey: [ 'session', +(session_id || -1) ], 
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

	useEffect(() => { 
		function init () { if(tmp__session) setSession(tmp__session) }
		init()
	}, [ tmp__session ])
	

	// ____________________ List_Players ____________________

	const { data: list_players, isLoading: isLoading__list_players, error: error__list_players } = useQuery({
		queryFn: () => get__session_players(axiosPrivate, +(session_id || -1)), 
		queryKey: [ 'session', +(session_id || -1), 'players' ], 
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
		queryFn: () => get__analytics_session(axiosPrivate, +(session_id || -1)), 
		queryKey: [ 'session', +(session_id || -1), 'analytics' ], 
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
			setList__years(analytics.List__Years)
		}
		init()
	}, [ analytics ])





	useEffect(() => {

		if(!session_id) navigate(-1)

		refetch()

	}, [ // eslint-disable-line
		session?.Statistics_View, 
		session?.Statistics_View_Month, 
		session?.Statistics_View_Year, 
	])

	const mutate__show_border = useMutation({
		mutationFn: (json: Type__Client_To_Server__Session__PATCH) => patch__session(axiosPrivate, json), 
		onSuccess: (_, json) => {
			setSession(prev => {
				if(!prev) return prev
				const tmp 					= { ...prev }
				tmp.Statistics_Show_Border 	= Boolean(json.Statistics_Show_Border)
				query_client.setQueryData([ 'session', prev.id ], tmp)
				return tmp
			})
			refetch()
		}, 
		onError: err => {
			handle_error({
				err, 
			})
		}
	})

	const sync__show_border = () => {

		if(!session) return
		
		mutate__show_border.mutate({
			SessionID: 				session.id, 
			Statistics_Show_Border: !session.Statistics_Show_Border, 
		})

	}

	useEffect(() => { 
		setLoading__universal_loader(
			mutate__show_border.isPending ||
			isLoading__user || 
			isLoading__session || 
			isLoading__analytics || 
			isLoading__list_players
		)
	}, [ 
		setLoading__universal_loader, 
		mutate__show_border, 
		isLoading__user, 
		isLoading__session, 
		isLoading__analytics, 
		isLoading__list_players
	])





	return <>

		<Popup__Options user={user}/>



		<div className='analytics_session'>

			<Previous onClick={() => navigate(-1)}/>




			{/* __________________________________________________ Charts __________________________________________________ */}
			{list_players && session && total?.Data && <>
				<div className='analytics_session_charts box'>



					{/* ____________________ Select ____________________ */}

					<Statistics__Select_View
						list__years={list__years}
						user={user}
						session={session}
						isSession={true}
					/>



					{/* ____________________ Doughnut ____________________ */}

					<ChartDoughnut
						List_Players={list_players}
						Total_Wins={total?.Total__Wins} 
						IsBorderVisible={session?.Statistics_Show_Border}
					/>



					{/* ____________________ Show border ____________________ */}

					<div className='analytics_session_show_border'>
						{mutate__show_border.isPending && <>
							<LoaderBox
								dark={true}
								className='analytics_session_show_border-loader'
							/>
						</>}
						{!mutate__show_border.isPending && <>
							<input 
								type='checkbox' 
								checked={session?.Statistics_Show_Border || false} 
								onChange={sync__show_border}
							/>
						</>}
						<span>Umrandung anzeigen</span>
					</div>



					{/* ____________________ Graph ____________________ */}

					<h2>Verlauf</h2>

					
					<Chart_Graph
						labels={session?.Statistics_View === 'statistics_year' ? [ '0', ...Type__List_Months ] : total?.Data ? Object.keys(total?.Data) : []}
						IsBorderVisible={Boolean(session?.Statistics_Show_Border)}
						List_Players={list_players}
						Data={total?.Data}
					/>

				</div>





				{/* __________________________________________________ More statistics __________________________________________________ */}

				<div className='analytics_session_more-statistics box'>
					
					<h2>Mehr Statistiken</h2>

					<div className='statistic'>
						<span>Spiele gespielt</span>
						<span>{total.Total__Games_Played}</span>
					</div>

					<div className='statistic'>
						<span>Davon unentschieden</span>
						<span>{total.Total__Draws}</span>
					</div>



					<div className='chart-container'>

						<span>Niedriste Punktzahlen:</span>

						<Chart_Bar_Session
							IsBorderVisible={session.Statistics_Show_Border}
							List_Players={list_players}
							JSON={total.Scores__Lowest}
						/>

					</div>



					<div className='chart-container'>

						<span>Höchste Punktzahlen:</span>

						<Chart_Bar_Session
							IsBorderVisible={session.Statistics_Show_Border}
							List_Players={list_players}
							JSON={total.Scores__Highest}
						/>
						
					</div>



					<div className='chart-container'>

						<span>⌀ Durschnittliche Punktzahlen:</span>

						<Chart_Bar_Session
							IsBorderVisible={session.Statistics_Show_Border}
							List_Players={list_players}
							JSON={total.Scores__Average}
						/>

					</div>

				</div>
			</>}

		</div>
	</>
}
