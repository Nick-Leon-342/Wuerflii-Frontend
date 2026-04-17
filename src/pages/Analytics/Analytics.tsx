

import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import useErrorHandling from '../../hooks/useErrorHandling'
import { Enum__Months } from '@/types/Enum/Enum__Months'
import { get__analytics } from '../../api/analytics'
import { get__user } from '../../api/user'

import Statistics__Select_View from '../../components/Statistics/Statistics__Select_View'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Popup_Settings from '../../components/misc/Popup__Settings'
import Chart_Bar from '../../components/Statistics/Chart_Bar'
import Previous from '../../components/misc/Previous'
import { Spinner } from '@/components/ui/spinner'





export default function Analytics() {

	const navigate 		= useNavigate()
	const { t } 		= useTranslation()
	const handle_error	= useErrorHandling()





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


	// ____________________ Analytics ____________________

	const { data: total, error: error__analytics } = useQuery({
		queryFn: () => get__analytics(), 
		queryKey: [ 'analytics' ], 
	})

	if(error__analytics) {
		handle_error({
			err: error__analytics, 
		})
	}





	function get_years_until_now(): Array<number> {
		if(!user) return []
		const start = new Date(user.createdAt).getFullYear()
		const current = new Date().getFullYear()

		if(current < start) return []
		
		return Array.from({ length: current - start + 1 }, (_, index) => start + index)
	}





	return <>

		<Popup_Settings user={user}/>





		<div className='analytics flex flex-col w-9/10 gap-4 xl:w-250'>

			<Previous onClick={() => navigate(-1)}>
				{user && <>
					<Statistics__Select_View
						list__years={get_years_until_now()}
						isSession={false}
						user={user}
					/>
				</>}
			</Previous>


			{(!total || !user) && <div className='flex flex-row justify-center'><Spinner/></div>}

			{total && user && <>

				<Chart_Bar
					labels={user?.Statistics__View === 'STATISTICS_YEAR' ? Enum__Months.map(month => t('months.' + month)) : total?.Data ? Object.keys(total?.Data) : []}
					data={total.Data}
				/>



				<Card>
					<CardHeader>
						<CardTitle>{t('statistics')}</CardTitle>
					</CardHeader>
					
					<CardContent className='text-lg'>
						<div className='[&_div]:flex [&_div]:justify-between [&_div]:sm:gap-20 sm:w-max'>
							{user?.Statistics__View === 'STATISTICS_OVERALL' && <>
								<div>
									<span>{t('amount_of_different_sessions')}:</span>
									<span>{total.Total__Sessions}</span>
								</div>
							</>}
							
							<div>
								<span>{t('amount_of_games')}:</span>
								<span>{total.Total__Games_Played}</span>
							</div>
						</div>
					</CardContent>
				</Card>

			</>}

		</div>
	</>
}
