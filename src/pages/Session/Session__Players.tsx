

import './scss/Session_Players.scss'

import { v4 } from 'uuid'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import CustomButton from '../../components/misc/Custom_Button'
import OptionsDialog from '../../components/Popup/Popup__Options'
import Previous from '../../components/NavigationElements/Previous'
import DragAndDropNameColorList from '../../components/misc/Drag_And_Drop_Name_Color_List'

import Context__Error from '../../Provider_And_Context/Provider_And_Context__Error'

import Person_Add from '../../svg/Person_Add.svg?react'
import Person_Remove from '../../svg/Person_Remove.svg?react'

import { get__user } from '../../api/user'
import { get__session_players, get__session_players_env, patch__session_players, post__session_players } from '../../api/session/session_players'

import type { Type__Client_To_Server__Player__POST } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Player__POST'
import type { Type__Client_To_Server__Session_Players__POST_And_PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session_Players__POST_And_PATCH'





export default function Session__Players() {

	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { session_id } = useParams()
	const { setError } = useContext(Context__Error)


	// ____________________ Players ____________________

	const [ isInit, 		setIsInit		] = useState<boolean>(false)
	const [ list_players, 	setList_players	] = useState<Array<Type__Client_To_Server__Player__POST>>([])





	// __________________________________________________ Queries __________________________________________________

	// ____________________ User ____________________

	const { data: user, isLoading: isLoading__user, error: error__user } = useQuery({
		queryKey: [ 'user' ], 
		queryFn: () => get__user(axiosPrivate), 
	})

	if(error__user) {
		handle_error({
			err: error__user, 
		})
	}


	// ____________________ Env_Variables ____________________

	const { data: env_variables, isLoading: isLoading__env_variables, error: error__env_variables } = useQuery({
		queryKey: [ 'session', 'players', 'env' ], 
		queryFn: () => get__session_players_env(axiosPrivate), 
	})

	if(error__env_variables) {
		handle_error({
			err: error__env_variables, 
		})
	}


	// ____________________ List_Players ____________________

	const { data: tmp__list_players, isLoading: isLoading__list_players, error: error__list_players } = useQuery({
		queryKey: [ 'session', +(session_id || -1), 'players' ], 
		queryFn: () => get__session_players(axiosPrivate, +(session_id || -1)), 
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





	// __________________________________________________ Mutations __________________________________________________

	const mutate__players_add = useMutation({
		mutationFn: (json: Type__Client_To_Server__Session_Players__POST_And_PATCH) => post__session_players(axiosPrivate, json), 
		onSuccess: data => {
			query_client.setQueryData([ 'session', +(session_id || -1), 'players' ], data)
			navigate(`/session/${session_id}/preview`, { replace: true })
		}, 
		onError: err => {
			handle_error({
				err, 
				handle_404: () => {
					alert('Die Partie wurde nicht gefunden.')
					navigate('/', { replace: true })
				}, 
				handle_409: () => {
					alert('Es trat ein Fehler auf.\nFür diese Partie wurde Spieler bereits angelegt.')
					navigate(`/session/${session_id}/players`, { replace: true })
				}
			})
		}, 
	})

	const mutate__players_edit = useMutation({
		mutationFn: (json: Type__Client_To_Server__Session_Players__POST_And_PATCH) => patch__session_players(axiosPrivate, json), 
		onSuccess: () => {
			query_client.setQueryData([ 'session', +(session_id || -1), 'players' ], list_players)
			navigate(-1)
		}, 
		onError: err => {
			handle_error({
				err, 
				handle_404: () => {
					alert('Die Partie wurde nicht gefunden.')
					navigate('/', { replace: true })
				}
			})
		}, 
	})






	function new_player( list: Array<Type__Client_To_Server__Player__POST> ): Type__Client_To_Server__Player__POST { 
		return {
			id:		v4(), 
			Name:	`Spieler_${list.length + 1}`, 
			Color:	list.length % 2 === 0 ? '#ffffff' : '#ADD8E6'
		}
	}

	function add_player() {
		
		if(list_players.length === env_variables?.MAX_PLAYERS) return setError(`Es dürfen maximal nur ${env_variables?.MAX_PLAYERS} Spieler sein.`)

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

		if(!list_players || list_players.some(p => p.Name.length > (env_variables?.MAX_LENGTH_PLAYER_NAME || -1))) return setError(`Die Spielernamen dürfen nicht länger als ${env_variables?.MAX_LENGTH_PLAYER_NAME} Zeichen sein.`)

		const json: Type__Client_To_Server__Session_Players__POST_And_PATCH = { 
			SessionID:		+(session_id || -1), 
			List_Players:	list_players, 
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

		<OptionsDialog user={user}/>



		<div className='session_players'>

			<Previous onClick={() => navigate(-1)}>
				{isInit && <>
					<div className='session_players_previous-container'>
						<button 
							className='button button_reverse_red button_scale_3 session_players_previous'
							onClick={remove_player}
						><Person_Remove/></button>
						<button 
							className='button button_reverse button_scale_3 session_players_previous'
							onClick={add_player}
						><Person_Add/></button>
					</div>
				</>}
			</Previous>



			{env_variables && <div className='session_players_list'>
				<DragAndDropNameColorList
					list_edit_players={list_players}
					setList_edit_players={setList_players}
					MAX_LENGTH_PLAYER_NAME={env_variables?.MAX_LENGTH_PLAYER_NAME}
				/>
			</div>}



			<CustomButton 
				onClick={save}
				text={'Speichern'}
				loading={isLoading__user || isLoading__list_players || isLoading__env_variables}
			/>

		</div>

	</>
}
