

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import type { Type__Session, Type__Session_PATCH } from '../../types/Zod__Session'
import { get__session_players } from '../../api/session/session_players'
import { get__session, patch__session } from '../../api/session/session'
import { get__analytics_session } from '../../api/analytics'
import useErrorHandling from '../../hooks/useErrorHandling'
import { Enum__Months } from '@/types/Enum/Enum__Months'
import { get__user } from '../../api/user'

import Statistics__Select_View from '../../components/Statistics/Statistics__Select_View'
import Chart_Bar_Session from '../../components/Statistics/Chart_Bar_Session'
import Chart_Doughnut from '../../components/Statistics/Chart_Doughnut'
import Popup__Settings from '../../components/misc/Popup__Settings'
import Chart_Graph from '../../components/Statistics/Chart_Graph'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Previous from '../../components/misc/Previous'
import { ArrowBigDown, ArrowBigUp, CircleSlash2, Square, SquareCheck } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'





export default function Analytics_Session() {

	const navigate 		= useNavigate()
	const { t } 		= useTranslation()
	const query_client 	= useQueryClient()
	const handle_error	= useErrorHandling()

	const { session_id } = useParams()
	
	const [ session, setSession ] = useState<Type__Session>()



	// __________________________________________________ Queries __________________________________________________

	// ____________________ User ____________________

	const { data: user, error: error__user } = useQuery({
		queryFn: () => get__user(), 
		queryKey: [ 'user' ], 
	})

	if(error__user) {
		handle_error({
			err: error__user, 
		})
	}


	// ____________________ Session ____________________

	const { data: tmp__session, error: error__session } = useQuery({
		queryFn: () => get__session(+(session_id || -1)), 
		queryKey: [ 'session', +(session_id || -1) ], 
	})

	if(error__session) {
		handle_error({
			err: error__session, 
			handle_404: () => {
				toast.error(t('session_not_found'))
				navigate('/', { replace: true })
			}
		})
	}

	useEffect(() => { 
		function init () { if(tmp__session) setSession(tmp__session) }
		init()
	}, [ tmp__session ])
	

	// ____________________ List__Players ____________________

	const { data: list_players, error: error__list_players, isLoading: isLoading__list_players } = useQuery({
		queryFn: () => get__session_players(+(session_id || -1)), 
		queryKey: [ 'session', +(session_id || -1), 'players' ], 
	})

	if(error__list_players) {
		handle_error({
			err: error__list_players, 
			handle_404: () => {
				toast.error(t('session_not_found'))
				navigate('/', { replace: true })
			}
		})
	}


	// ____________________ Analytics ____________________

	const { data: total, error: error__analytics, isLoading: isLoading__analytics } = useQuery({
		queryFn: () => get__analytics_session(+(session_id || -1)), 
		queryKey: [ 'session', +(session_id || -1), 'analytics' ], 
	})

	if(error__analytics) {
		handle_error({
			err: error__analytics, 
			handle_409: () => {
				toast.error(t('no_data_yet'))
			},
		})
	}





	const mutate__show_border = useMutation({
		mutationFn: (json: Type__Session_PATCH) => patch__session(+(session_id || -1), json), 
		onSuccess: (_, json) => {
			setSession(prev => {
				if(!prev) return prev
				const tmp 					= { ...prev }
				tmp.Statistics__Show_Border = Boolean(json.Statistics__Show_Border)
				query_client.setQueryData([ 'session', prev.id ], tmp)
				return tmp
			})
		}, 
		onError: err => {
			handle_error({
				err, 
			})
		}
	})

	const sync__show_border = () => {

		if(!session) return
		
		mutate__show_border.mutate({ Statistics__Show_Border: !session.Statistics__Show_Border })

	}





	return <>

		<Popup__Settings user={user}/>



		<div className='analytics_session flex flex-col items-center bg-gray-100 w-full py-4 flex-1!'>
			<Card className='flex flex-col w-9/10 gap-4 xl:w-250'>
				<CardContent className='flex flex-col gap-4'>

					<Previous onClick={() => navigate(-1)}>
						{session?.View__List_Years && <>
							<Statistics__Select_View
								list__years={session.View__List_Years}
								session={session}
								isSession={true}
								user={user}
							/>
						</>}
					</Previous>



					{(isLoading__list_players || isLoading__analytics) && <div className='flex flex-row justify-center'><Spinner/></div>}




					{list_players && session && total?.Data && <>


						{/* ____________________ Doughnut ____________________ */}

						<Chart_Doughnut
							List__Players={list_players}
							Total_Wins={total?.Total__Wins} 
							IsBorderVisible={session?.Statistics__Show_Border}
						/>



						{/* ____________________ Show border ____________________ */}

						<Button
							variant='outline'
							onClick={sync__show_border}
							className='w-full justify-baseline'
						>
							{mutate__show_border.isPending && <Spinner/>}
							{!mutate__show_border.isPending && (session?.Statistics__Show_Border 
								? <SquareCheck/>
								: <Square/>
							)}
							<span>{t('show_border')}</span>
						</Button>



						{/* ____________________ Graph ____________________ */}
						
						<Chart_Graph
							labels={session?.Statistics__View === 'STATISTICS_YEAR' ? [ '0', ...Enum__Months.map(month => t('months.' + month)) ] : total?.Data ? Object.keys(total?.Data) : []}
							IsBorderVisible={Boolean(session?.Statistics__Show_Border)}
							List__Players={list_players}
							Data={total?.Data}
						/>



						{/* ____________________ More statistics ____________________ */}

						<Card>
							<CardHeader>
								<CardTitle>{t('more_statistics')}</CardTitle>
							</CardHeader>

							<CardContent className='text-lg [&_div]:flex [&_div]:justify-between [&_div]:sm:gap-20 sm:w-max'>
								<div>
									<span>{t('games_played')}</span>
									<span>{total.Total__Games_Played}</span>
								</div>

								<div>
									<span>{t('draws')}</span>
									<span>{total.Total__Draws}</span>
								</div>
							</CardContent>
						</Card>



						{/* ____________________ Points ____________________ */}

						<div className='flex flex-col gap-4 text-lg font-bold [&_div]:mt-4! [&_span]:flex [&_span]:gap-2'>

							<div>

								<span><ArrowBigDown/> {t('points_minimum')}:</span>

								<Chart_Bar_Session
									IsBorderVisible={session.Statistics__Show_Border}
									List__Players={list_players}
									JSON={total.Scores__Lowest}
								/>

							</div>



							<div>

								<span><ArrowBigUp/> {t('points_maximum')}:</span>

								<Chart_Bar_Session
									IsBorderVisible={session.Statistics__Show_Border}
									List__Players={list_players}
									JSON={total.Scores__Highest}
								/>
								
							</div>



							<div>

								<span><CircleSlash2/> {t('points_average')}:</span>

								<Chart_Bar_Session
									IsBorderVisible={session.Statistics__Show_Border}
									List__Players={list_players}
									JSON={total.Scores__Average}
								/>

							</div>

						</div>

					</>}

				</CardContent>
			</Card>
		</div>
	</>
}
