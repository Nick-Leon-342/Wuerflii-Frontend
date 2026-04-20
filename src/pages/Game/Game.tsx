

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import type { Type__Player_With_Table_Columns } from '@/types/Zod__Player'
import { get__table_columns } from '@/api/table_columns'
import useErrorHandling from '@/hooks/useErrorHandling'
import { get__session } from '@/api/session/session'
import { useUser } from '@/hooks/useUser'
import { post__game } from '@/api/game'

import Table_Player from '@/components/Game/Game_Tables/Table_Player'
import Popup__Settings from '@/components/misc/Popup__Settings'
import Game__Settings from '@/components/Game/Game__Settings'
import Custom_Button from '@/components/misc/Custom_Button'
import Table from '@/components/Game/Game_Tables/Table'
import { toast } from 'sonner'





export default function Game() {

	const { user }			= useUser()
	const { session_id } 	= useParams()
	const navigate 			= useNavigate()
	const { t } 			= useTranslation()
	const query_client 		= useQueryClient()
	const handle_error 		= useErrorHandling()

	const [ loading__finish_game, 	setLoading__finish_game	] = useState<boolean>(false)

	const [ surrender_winner, 		setSurrender_winner		] = useState<Type__Player_With_Table_Columns>()	// Player-Object of the 'winner'





	// __________________________________________________ Queries __________________________________________________	
	
	// ____________________ Session ____________________

	const { data: session, error: error__session } = useQuery({
		queryKey: [ 'session', +(session_id || -1) ], 
		queryFn: () => get__session(+(session_id || -1)), 
	})

	if(error__session) {
		handle_error({
			err: error__session, 
			handle_404: () => {
				toast.error(t('error.session_not_found'))
				navigate('/', { replace: true })
			}
		})
	}
	

	// ____________________ List__Table_Columns ____________________	

	const [ list__player_with_table_columns, 	setList__player_with_table_columns	] = useState<Array<Type__Player_With_Table_Columns>>([])

	const { data: tmp__list__table_columns, error: error__list__table_columns } = useQuery({
		queryKey: [ 'session', +(session_id || -1), 'table_columns' ], 
		queryFn: () => get__table_columns(+(session_id || -1)), 
	})

	if(error__list__table_columns) {
		handle_error({
			err: error__list__table_columns, 
			handle_404: () => {
				toast.error(t('error.resource_not_found'))
				navigate('/', { replace: true })
			}
		})
	}

	useEffect(() => {
		function init() {
			if(tmp__list__table_columns) setList__player_with_table_columns(tmp__list__table_columns)
		}
		init()
	}, [ tmp__list__table_columns ])





	useEffect(() => {

		if(!session_id) navigate('/', { replace: true })
		
		setTimeout(() => window.scrollTo({ top: 1500, left: 1250, behavior: 'smooth' }), 50)

	}, [ session ]) // eslint-disable-line

	const finish_game = () => {
	
		if(!session || !list__player_with_table_columns || !list__player_with_table_columns) return

		if(!surrender_winner && list__player_with_table_columns.some(table_column => table_column.List__Table_Columns.some(tc => !tc.Bottom_Table_TotalScore))) return toast.info(t('please_enter_all_values'))	
		if(list__player_with_table_columns.length === 1) return navigate('/', { replace: true })

		setLoading__finish_game(true)

		post__game(+(session_id || -1), { Surrendered_PlayerID: surrender_winner?.id }).then(data => {

			query_client.removeQueries({
				queryKey: [ 'session', session.id, 'table_columns' ]
			})
			navigate(`/game/end?session_id=${session.id}&finalscore_id=${data.FinalScoreID}`, { replace: true })

		}).catch((err) => {

			handle_error({
				err, 
				handle_409: () => toast.error(t('please_enter_all_values'))
			})

		}).finally(() => setLoading__finish_game(false))
	
	}





	return <>

		<Popup__Settings user={user}/>



		{/* __________________________________________________ Game __________________________________________________ */}

		<div className='absolute top-0 left-0'>
			<div className='flex flex-col gap-4 m-300'>

				{session && <>
					<Table_Player 
						setList__player_with_table_columns={setList__player_with_table_columns}
						list__player_with_table_columns={list__player_with_table_columns}
						session={session}
						disabled={false}
					/>
				</>}

				<Table 
					setList__player_with_table_columns={setList__player_with_table_columns}
					list__player_with_table_columns={list__player_with_table_columns}
					session={session}
					disabled={false}
				/>

				<footer className='flex flex-row justify-between gap-4'>

					<Game__Settings
						list__player_with_table_columns={list__player_with_table_columns}
						loading__finish_game={loading__finish_game}
						setSurrender_winner={setSurrender_winner}
						surrender_winner={surrender_winner}
						finish_game={finish_game}
						session={session}
					/>

					<Custom_Button 
						loading={loading__finish_game}
						text={t('finish_game')}
						onClick={finish_game}
						className='flex-1'
					/>

				</footer>
				
			</div>
		</div>
	</>
}
