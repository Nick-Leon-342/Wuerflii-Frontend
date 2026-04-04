

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { v4 } from 'uuid'

import type { Type__Client_To_Server__Session_Players__POST_And_PATCH } from '@/types/Type__Client_To_Server/Type__Client_To_Server__Session_Players__POST_And_PATCH'
import { get__session_players, get__session_players_env, patch__session_players, post__session_players } from '@/api/session/session_players'
import type { Type__Client_To_Server__Player__POST } from '@/types/Type__Client_To_Server/Type__Client_To_Server__Player__POST'
import useErrorHandling from '@/hooks/useErrorHandling'
import { get__user } from '@/api/user'

import DragAndDropNameColorList from '@/components/misc/Drag_And_Drop_Name_Color_List'
import Popup__Settings from '@/components/misc/Popup__Settings'
import Custom_Button from '@/components/misc/Custom_Button'
import Previous from '@/components/misc/Previous'
import { UserMinus, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'





export default function Session__Players() {

	const navigate		= useNavigate()
	const query_client	= useQueryClient()
	const { t }			= useTranslation()
	const handle_error	= useErrorHandling()

	const { session_id } = useParams()


	// ____________________ Players ____________________

	const [ isInit, 		setIsInit		] = useState<boolean>(false)
	const [ list_players, 	setList_players	] = useState<Array<Type__Client_To_Server__Player__POST>>([])





	// __________________________________________________ Queries __________________________________________________

	// ____________________ User ____________________

	const { data: user, isLoading: isLoading__user, error: error__user } = useQuery({
		queryKey: [ 'user' ], 
		queryFn: () => get__user(), 
	})

	if(error__user) {
		handle_error({
			err: error__user, 
		})
	}


	// ____________________ Env_Variables ____________________

	const { data: env_variables, isLoading: isLoading__env_variables, error: error__env_variables } = useQuery({
		queryKey: [ 'session', 'players', 'env' ], 
		queryFn: () => get__session_players_env(), 
	})

	if(error__env_variables) {
		handle_error({
			err: error__env_variables, 
		})
	}


	// ____________________ List__Players ____________________

	const { data: tmp__list_players, isLoading: isLoading__list_players, error: error__list_players } = useQuery({
		queryKey: [ 'session', +(session_id || -1), 'players' ], 
		queryFn: () => get__session_players(+(session_id || -1)), 
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





	// __________________________________________________ Mutations __________________________________________________

	const mutate__players_add = useMutation({
		mutationFn: (json: Type__Client_To_Server__Session_Players__POST_And_PATCH) => post__session_players(json), 
		onSuccess: data => {
			query_client.setQueryData([ 'session', +(session_id || -1), 'players' ], data)
			navigate(`/session/${session_id}/preview`, { replace: true })
		}, 
		onError: err => {
			handle_error({
				err, 
				handle_404: () => {
					toast.error(t('session_not_found'))
					navigate('/', { replace: true })
				}, 
				handle_409: () => {
					toast.error(t('players_already_exist'))
					navigate(`/session/${session_id}/players`, { replace: true })
				}
			})
		}, 
	})

	const mutate__players_edit = useMutation({
		mutationFn: (json: Type__Client_To_Server__Session_Players__POST_And_PATCH) => patch__session_players(json), 
		onSuccess: () => {
			query_client.setQueryData([ 'session', +(session_id || -1), 'players' ], list_players)
			navigate(-1)
		}, 
		onError: err => {
			handle_error({
				err, 
				handle_404: () => {
					toast.error(t('session_not_found'))
					navigate('/', { replace: true })
				}
			})
		}, 
	})






	function new_player( list: Array<Type__Client_To_Server__Player__POST> ): Type__Client_To_Server__Player__POST { 
		return {
			id:		v4(), 
			Name:	`${t('player')}_${list.length + 1}`, 
			Color:	list.length % 2 === 0 ? '#ffffff' : '#ADD8E6'
		}
	}

	function add_player() {
		
		if(list_players.length === env_variables?.MAX_PLAYERS) return toast.error(t('error.players_too_many', { max: env_variables?.MAX_PLAYERS }))

		setList_players(prev => {
			const list = [ ...prev ]
			list.push(new_player(prev))
			return list
		})
		
	}

	function remove_player() {

		if(list_players.length === 1) return setList_players(() => [ new_player([]) ])

		setList_players(prev => {
			const list = [ ...prev ]
			list.pop()
			return list
		})

	}

	async function save() {

		if(!list_players || list_players.some(p => p.Name.length > (env_variables?.MAX_LENGTH_PLAYER_NAME || -1))) return toast.error(t('error.player_name_too_long', { max: env_variables?.MAX_LENGTH_PLAYER_NAME }))

		const json: Type__Client_To_Server__Session_Players__POST_And_PATCH = { 
			SessionID:		+(session_id || -1), 
			List__Players:	list_players, 
		}

		if(isInit) {
			mutate__players_add.mutate(json)
		} else {
			mutate__players_edit.mutate(json)
		}

	}

	useEffect(() => {
		function init() {
			if(!tmp__list_players) return
			setIsInit(tmp__list_players.length === 0)
			setList_players(tmp__list_players.length > 0 ? structuredClone(tmp__list_players) : [ new_player([]) ])
		}
		init()
	}, [ tmp__list_players ])





	return <>

		<Popup__Settings user={user}/>



		<div className='session__players flex flex-col w-9/10 md:w-2xl gap-4'>

			<Previous onClick={() => navigate(-1)}>
				{isInit && <>
					<div className='flex flex-row [&_button]:w-10 [&_button]:h-10 [&_svg]:w-6! [&_svg]:h-6!'>
						<Button 
							variant='ghost'
							onClick={remove_player}
						><UserMinus className='text-destructive'/></Button>

						<Button 
							variant='ghost'
							onClick={add_player}
						><UserPlus className='text-primary'/></Button>
					</div>
				</>}
			</Previous>



			{env_variables && <div>
				<DragAndDropNameColorList
					list_edit_players={list_players}
					setList_edit_players={setList_players}
					MAX_LENGTH_PLAYER_NAME={env_variables?.MAX_LENGTH_PLAYER_NAME}
				/>
			</div>}



			<Custom_Button 
				loading={isLoading__user || isLoading__list_players || isLoading__env_variables || mutate__players_add.isPending || mutate__players_edit.isPending}
				text={t('save')}
				onClick={save}
			/>

		</div>

	</>
}
