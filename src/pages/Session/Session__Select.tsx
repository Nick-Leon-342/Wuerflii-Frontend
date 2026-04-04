

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import useErrorHandling from '../../hooks/useErrorHandling'

import type { Type__Client_To_Server__User__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__User__PATCH'
import { delete__session, get__sessions_list } from '../../api/session/session'
import type { Enum__View_Sessions } from '../../types/Enum/Enum__View_Sessions'
import type { Type__Session } from '../../types/Type__Session'
import useRedirectToLogin from '@/hooks/useRedirectToLogin'
import { get__user, patch__user } from '../../api/user'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronUp, SortDesc, Square, SquareCheck, Trash2 } from 'lucide-react'
import Popup__Settings from '@/components/misc/Popup__Settings'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { toast } from 'sonner'





export default function Session__Select() {

	const navigate			= useNavigate()
	const { t }				= useTranslation()
	const query_client		= useQueryClient()
	const handle_error		= useErrorHandling()
	const redirect_to_login	= useRedirectToLogin()

	const [ list_sessions, setList_sessions ] = useState<Array<Type__Session>>([]) 

	interface option {
		Text: 	string
		Alias:	Enum__View_Sessions
	}
	const list_orderOptions: Array<option> = [
		{ Text: t('recently_played'), 	Alias: 'LAST_PLAYED'	},
		{ Text: t('created'), 			Alias: 'CREATED'		},
		{ Text: t('name'), 				Alias: 'NAME'			},
	]



	// ________________________________________ Queries __________________________________________________

	// ____________________ User ____________________

	const { data: user, isLoading: isLoading__user, error: error__user } = useQuery({
		queryKey: [ 'user' ], 
		queryFn: () => get__user(), 
		
	})

	if(error__user) {
		handle_error({
			err: error__user
		})
	}


	// ____________________ List_Sessions ____________________

	const { data: tmp_list_sessions, isLoading: isLoading__list_sessions, error: error__list_sessions } = useQuery({
		queryFn: () => get__sessions_list(), 
		queryKey: [ 'session', 'list' ], 
	})

	if(error__list_sessions) {
		handle_error({
			err: error__list_sessions, 
		})
	}

	useEffect(() => {
		function init() {
			// List_Session is edited only in frontend (checkbox to delete multiple sessions), that's why the read-only tmp_list_sessions has to be copied into a editable variable
			// Reset Checkbox_Checked_To_Delete to false for all sessions when list updates
			const sessionsWithResetCheckbox = (tmp_list_sessions || []).map(session => ({
				...session,
				Checkbox_Checked_To_Delete: false
			}))
			setList_sessions(sessionsWithResetCheckbox)
	
			if(!tmp_list_sessions) return 
			// Cache all sessions and players to increase performance when selecting session
			for(const session of tmp_list_sessions) {
				query_client.setQueryData([ 'session', session.id ], session)
				query_client.setQueryData([ 'session', session.id, 'players' ], session.List__Players)
			}
		}
		init()
	}, [ tmp_list_sessions ]) // eslint-disable-line





	// __________________________________________________ Change List __________________________________________________

	const mutate__show_session_date = useMutation({
		mutationFn: () => patch__user({ Show__Session_Date: !user?.Show__Session_Date }), 
		onSuccess: () => {
			query_client.setQueryData([ 'user' ], { ...user, Show__Session_Date: !user?.Show__Session_Date })
		}, 
		onError: err => {
			handle_error({
				err, 
			})
		}
	})

	const mutate__show_session_names = useMutation({
		mutationFn: () => patch__user({ Show__Session_Names: !user?.Show__Session_Names }), 
		onSuccess: () => {
			query_client.setQueryData([ 'user' ], { ...user, Show__Session_Names: !user?.Show__Session_Names })
		}, 
		onError: err => {
			handle_error({
				err, 
			})
		}
	})

	const mutate__change_order = useMutation({
		mutationFn: (json: Type__Client_To_Server__User__PATCH) => patch__user(json), 
		onSuccess: ( _, json ) => {
			query_client.setQueryData([ 'user' ], { ...user, ...json })
			query_client.invalidateQueries({
				queryKey: [ 'session', 'list' ], 
				exact: true
			})
		}, 
		onError: err => {
			handle_error({
				err, 
			})
		}
	})

	function change_order(selected_option: Enum__View_Sessions) {

		mutate__change_order.mutate({
			View__Sessions: 		selected_option, 
			View__Sessions_Desc: selected_option === user?.View__Sessions ? !user?.View__Sessions_Desc : true
		})

	}





	// __________________________________________________ Delete __________________________________________________

	const mutate__delete = useMutation({
		mutationFn: (session_id: number) => delete__session(session_id),
		onSuccess: ( _, session_id ) => {
			query_client.setQueryData([ 'session', 'list' ], (list_sessions: Array<Type__Session>) => list_sessions.filter(session => session.id !== session_id))
		}, 
		onError: err => {
			handle_error({
				err, 
				handle_404: () => {
					toast.error(t('session_not_found'))
					redirect_to_login()
				}
			})
		}
	})

	const handle_delete = async () => {

		const multiple_sessions_selected = list_sessions?.filter(s => s.Checkbox_Checked_To_Delete).length > 1
		if(!window.confirm(multiple_sessions_selected ? t('sure_you_want_to_delete_sessions') : t('sure_you_want_to_delete_session'))) return

		for(const session of list_sessions) { if(session.Checkbox_Checked_To_Delete) {

			mutate__delete.mutate(session.id)

		}}

	}





	// __________________________________________________ Select Checkbox __________________________________________________

	const checkbox_click = ( index: number, clicked: boolean ) => {

		setList_sessions(prev => {
			const tmp = [ ...prev ]
			tmp[index].Checkbox_Checked_To_Delete = clicked
			return tmp
		})

	}





	return <>

		<Popup__Settings user={user}/>





		<div className='session__select flex flex-col w-9/10 lg:w-4xl gap-4'>
			
			<header className='flex flex-row justify-between'>

				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant='ghost'
							className='w-10! h-10!'
						><SortDesc className='w-8! h-8!'/></Button>
					</PopoverTrigger>



					<PopoverContent align='start'>

						{/* ____________________ Names ____________________ */}
						<Button
							onClick={() => mutate__show_session_names.mutate()}
							className='flex flex-row justify-between h-fit'
							disabled={mutate__show_session_names.isPending}
							variant='ghost'
						>
							<span>{t('show_session_name')}</span>
							{mutate__show_session_names.isPending && <Spinner/>}
							{!mutate__show_session_names.isPending && (user?.Show__Session_Names ? <SquareCheck/> : <Square/>)}
						</Button>

						{/* ____________________ Dates ____________________ */}
						<Button
							onClick={() => mutate__show_session_date.mutate()}
							className='flex flex-row justify-between h-fit'
							disabled={mutate__show_session_date.isPending}
							variant='ghost'
						>
							<span>{t('show_date')}</span>
							{mutate__show_session_date.isPending && <Spinner/>}
							{!mutate__show_session_date.isPending && (user?.Show__Session_Date ? <SquareCheck/> : <Square/>)}
						</Button>

						<Separator/>

						{/* ____________________ Order ____________________ */}
						<div className='flex flex-col'>
							{list_orderOptions.map(option => {
								const cs = user?.View__Sessions === option.Alias
								const desc = user?.View__Sessions_Desc

								return (
									<Button
										key={option?.Text}
										variant='ghost'
										onClick={() => change_order(option.Alias)}
										className={`flex flex-row justify-between h-fit${cs ? ' text-primary' : ' [&_svg]:opacity-0'}`}
									>
										{option.Text}
										<ChevronUp className={`transition-transform duration-500${desc ? ' rotate-180' : ''}`}/>
									</Button>
								)
								
							})}
						</div>

					</PopoverContent>
				</Popover>

				<Button
					className={`w-10! h-10!${list_sessions?.length === 0 ? ' opacity-0' : ''}`}
					disabled={mutate__delete.isPending || list_sessions.every(session => !session.Checkbox_Checked_To_Delete)}
					onClick={handle_delete} 
					variant={!mutate__delete.isPending && list_sessions.some(session => session.Checkbox_Checked_To_Delete) ? 'destructive' : 'ghost'}
				><Trash2 className='w-8! h-8!'/></Button>

			</header>





			{/* ____________________ Loading ____________________ */}

			{isLoading__list_sessions || isLoading__user && <Spinner/>}

			{/* ____________________ No session in list ____________________ */}

			{!isLoading__list_sessions && list_sessions?.length === 0 && <h1 className='flex flex-row justify-center text-xl font-bold'>{t('no_game_yet')}</h1>}

			{/* ____________________ Session list ____________________ */}

			{!isLoading__list_sessions && list_sessions?.length !== 0 && <>

				<div className='flex flex-col gap-2'>
					{list_sessions.map?.((session, index_session) => (
						<Button 
							key={index_session}
							style={{ 
								backgroundColor: session.Color + '70', 
								border: '2px solid' + session.Color + '90', 
							}}
							className='flex flex-row justify-baseline items-center gap-2 h-12 text-foreground'
							onClick={() => navigate(`/session/${session.id}/${session.List__Players?.length === 0 ? 'players' : 'preview'}`)}
						>

							<input 
								type='checkbox' 
								onClick={e => e.stopPropagation()}
								className='h-4 w-4 cursor-pointer shrink-0'
								checked={session.Checkbox_Checked_To_Delete}
								onChange={({ target }) => !mutate__delete.isPending && checkbox_click(index_session, target.checked)} 
							/>

							{session.List__Players && <>
								<div className='flex flex-col w-full md:items-center md:flex-row md:justify-between overflow-hidden md:gap-2'>

									<span className='block text-start w-full truncate'>
										{(user?.Show__Session_Names || session.List__Players.length === 0) && session.Name}
										{!user?.Show__Session_Names && session.List__Players.length > 0 && session.List__Players.map(p => p.Name).join(' vs ')}
									</span>

									<span className='flex text-sm text-muted-foreground shrink-0'>
										{user?.Show__Session_Date && <label className='date'>{format(new Date(session?.LastPlayed || new Date()), 'dd.MM.yyyy')}</label>}
									</span>

								</div>
							</>}

						</Button>
					))}
				</div>

			</>}





			<Button
				variant='link'
				className='p-0 w-fit h-fit text-md'
				onClick={() => navigate('/session', { replace: false })}
			>{t('create_session')}</Button>

		</div>

	</>
}
