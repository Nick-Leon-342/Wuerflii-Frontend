

import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import {useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import Context__Universal_Loader from '@/Provider_And_Context/Provider_And_Context__Universal_Loader'
import useErrorHandling from '@/hooks/useErrorHandling'

import { get__session_players } from '@/api/session/session_players'
import { get__session } from '@/api/session/session'
import { get__user } from '@/api/user'
import { api } from '@/api/axios'

import type { Type__Final_Score } from '@/types/Type__Final_Score'
import type { Type__Session } from '@/types/Type__Session'

import Session__Preview___Player_Table from '@/components/Session__Preview/Session__Preview___Player_Table'
import Session__Preview___Final_Scores from '@/components/Session__Preview/Session__Preview___Final_Scores'
import Session__Preview___Settings from '@/components/Session__Preview/Session__Preview___Settings'
import Session__Preview___Edit from '@/components/Session__Preview/Session__Preview___Edit'
import Popup__Settings from '@/components/Popup/Popup__Settings'
import Custom_Button from '@/components/misc/Custom_Button'
import { Button } from '@/components/ui/button'





export default function Session__Preview() {

	const navigate		= useNavigate()
	const { t }			= useTranslation()
	const handle_error	= useErrorHandling()

	const { session_id }	= useParams()
	
	const [ current_top_row,		setCurrent_top_row			] = useState<Type__Final_Score>()
	const [ loading_preparing_game, setLoading_preparing_game	] = useState<boolean>(false)
	const [ do_final_scores_exist, 	setDo_final_scores_exist	] = useState<boolean>(false)





	// __________________________________________________ Queries __________________________________________________
		
	// ____________________ User ____________________

	const { data: user, isLoading: isLoading__user, error: error__user } = useQuery({
		queryFn: () => get__user(), 
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
		queryFn: () => get__session(+(session_id || -1)), 
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
		queryFn: () => get__session_players(+(session_id || -1)), 
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

		<Popup__Settings user={user}/>



		<div className='session__preview flex flex-col w-9/10 lg:w-4xl gap-4 overflow-hidden'>

			<header className='flex flex-row justify-between'>

				<Session__Preview___Edit
					setSession={setSession}
					session={session}
				/>

				<Session__Preview___Settings
					do_final_scores_exist={do_final_scores_exist}
					session={session}
				/>

			</header>



			<div className='flex flex-col min-w-100 overflow-x-auto'>
				
				{/* ____________________ Table ____________________ */}

				<Session__Preview___Player_Table
					current_top_row={current_top_row}
					list__players={list_players}
					session={session}
				/>



				{/* ____________________ List ____________________ */}

				<Session__Preview___Final_Scores
					setDo_final_scores_exist={setDo_final_scores_exist}
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
