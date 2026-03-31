

import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import {useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import Context__Universal_Loader from '@/Provider_And_Context/Provider_And_Context__Universal_Loader'
import useErrorHandling from '@/hooks/useErrorHandling'
import useAPI from '@/hooks/useAPI'

import { get__session_players } from '@/api/session/session_players'
import { get__session } from '@/api/session/session'
import { get__user } from '@/api/user'

import type { Type__Final_Score } from '@/types/Type__Final_Score'
import type { Type__Session } from '@/types/Type__Session'

import Session__Preview___Player_Table from '@/components/Session__Preview/Session__Preview___Player_Table'
import Session__Preview___Final_Scores from '@/components/Session__Preview/Session__Preview___Final_Scores'
import Session__Preview___Edit from '@/components/Session__Preview/Session__Preview___Edit'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import OptionsDialog from '@/components/Popup/Popup__Settings'
import Custom_Button from '@/components/misc/Custom_Button'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'





export default function Session__Preview() {
	
	const api			= useAPI()
	const navigate		= useNavigate()
	const { t }			= useTranslation()
	const handle_error	= useErrorHandling()

	const { session_id }	= useParams()
	
	const [ current_top_row,		setCurrent_top_row			] = useState<Type__Final_Score>()
	const [ loading_preparing_game, setLoading_preparing_game	] = useState<boolean>(false)





	// __________________________________________________ Queries __________________________________________________
		
	// ____________________ User ____________________

	const { data: user, isLoading: isLoading__user, error: error__user } = useQuery({
		queryFn: () => get__user(api), 
		queryKey: [ 'user' ], 
	})

	if(error__user) {
		handle_error({
			err: error__user, 
		})
	}
	
	
	// ____________________ Session ____________________

	const [ session, setSession ] = useState<Type__Session>()

	const { data: tmp__session, isLoading: isLoading__session, error: error__session } = useQuery({
		queryFn: () => get__session(api, +(session_id || -1)), 
		queryKey: [ 'session', +(session_id || -1) ], 
	})

	if(error__session) {
		handle_error({
			err: error__session, 
			handle_404: () => {
				alert(t('session_not_found'))
				navigate('/', { replace: true })
			}
		})
	}

	useEffect(() => { setSession(tmp__session) }, [ tmp__session ])


	// ____________________ List__Players ____________________

	const { data: list_players, isLoading: isLoading__list_players, error: error__list_players } = useQuery({
		queryKey: [ 'session', +(session_id || -1), 'players' ], 
		queryFn: () => get__session_players(api, +(session_id || -1)), 
	})

	if(error__list_players) {
		handle_error({
			err: error__list_players, 
			handle_404: () => {
				alert(t('session_not_found'))
				navigate('/', { replace: true })
			}
		})
	}





	// __________________________________________________ Universal Loader __________________________________________________

	const { setLoading__universal_loader } = useContext(Context__Universal_Loader)
	useEffect(() => setLoading__universal_loader(isLoading__user || isLoading__session || isLoading__list_players ), [ setLoading__universal_loader, isLoading__user, isLoading__session, isLoading__list_players ])

	const start_game = () => {

		if(session?.CurrentGameStart) return navigate(`/game?session_id=${session?.id}`, { replace: false })

		setLoading_preparing_game(true)
		api.get(`/game?session_id=${session?.id}`).then(() => {

			navigate(`/game?session_id=${session?.id}`, { replace: false })

		}).catch(err => {

			handle_error({
				err, 
			})

		}).finally(() => setLoading_preparing_game(true))

	}




	
	return <>

		<OptionsDialog user={user}/>



		<div className='session__preview flex flex-col w-9/10 lg:w-4xl gap-4'>

			<header className='flex flex-row justify-between'>

				<Session__Preview___Edit
					setSession={setSession}
					session={session}
				/>

				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant='ghost'
							className='w-10 h-10'
						><Settings className='w-8! h-8!'/></Button>
					</PopoverTrigger>

					<PopoverContent 
						className='gap-4 [&_button]:justify-start!'
						align='end'
					>
						
						<Button
							variant='outline'
							onClick={() => navigate(`/session/${session?.id}/analytics`)}
						>{t('statistics')}</Button>

						<Separator/>

						<span className='text-lg font-bold'>{t('edit')}</span>

						<Button
							variant='outline'
							onClick={() => navigate(`/session/${session?.id}`)}
						>{t('session')}</Button>
						
						<Button
							variant='outline'
							onClick={() => navigate(`/session/${session?.id}/players`)}
						>{t('players')}</Button>

					</PopoverContent>
				</Popover>


			</header>



			<div>
				
				{/* ____________________ Table ____________________ */}

				<Session__Preview___Player_Table
					current_top_row={current_top_row}
					list__players={list_players}
					session={session}
				/>



				{/* ____________________ List ____________________ */}

				<Session__Preview___Final_Scores
					setCurrent_top_row={setCurrent_top_row}
					list__players={list_players}
					session={session}
				/>

			</div>



			<Custom_Button
				text={t('lets_go')}
				onClick={start_game}
				loading={loading_preparing_game}
			/>

			<Button
				variant='link'
				className='p-0 w-fit h-fit text-md'
				onClick={() => navigate('/', { replace: false })}
			>{t('back')}</Button>

		</div>

	</>
}
