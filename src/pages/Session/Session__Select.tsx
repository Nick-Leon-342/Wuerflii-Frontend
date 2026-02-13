

import './scss/Session__Select.scss'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatDate } from '../../logic/utils'

import Context__Universal_Loader from '../../Provider_And_Context/Provider_And_Context__Universal_Loader'
import useErrorHandling from '../../hooks/useErrorHandling'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import Custom_Link from '../../components/NavigationElements/Custom_Link'
import Popup__Dropdown from '../../components/Popup/Popup__Dropdown'
import OptionsDialog from '../../components/Popup/Popup__Options'
import LoaderBox from '../../components/Loader/Loader_Box'

import ArrowDown from '../../svg/Arrow_Down.svg?react'
import ListSort from '../../svg/List_Sort.svg?react'
import Trashcan from '../../svg/Trashcan.svg?react'

import { delete__session, get__sessions_list } from '../../api/session/session'
import { get__user, patch__user } from '../../api/user'

import type { Type__Client_To_Server__User__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__User__PATCH'
import type { Type__Context__Universal_Loader } from '../../types/Type__Context/Type__Context__Universal_Loader'
import type { Enum__View_Sessions } from '../../types/Enum/Enum__View_Sessions'
import type { Type__Session } from '../../types/Type__Session'





export default function Session__Select() {

	const navigate = useNavigate()
	const { t } = useTranslation()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const ref = useRef<HTMLButtonElement>(null)
	const ref___show__session_date = useRef<HTMLInputElement>(null)
	const ref___show__session_names = useRef<HTMLInputElement>(null)

	const [ list_sessions, setList_sessions ] = useState<Array<Type__Session>>([]) 

	const [ show_settings, setShow_settings ] = useState<boolean>(false)

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
		queryFn: () => get__user(axiosPrivate), 
		
	})

	if(error__user) {
		handle_error({
			err: error__user
		})
	}


	// ____________________ List_Sessions ____________________

	const { data: tmp_list_sessions, isLoading: isLoading__list_sessions, error: error__list_sessions } = useQuery({
		queryFn: () => get__sessions_list(axiosPrivate), 
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
		mutationFn: () => patch__user(axiosPrivate, { Show__Session_Date: !user?.Show__Session_Date }), 
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
		mutationFn: () => patch__user(axiosPrivate, { Show__Session_Names: !user?.Show__Session_Names }), 
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
		mutationFn: (json: Type__Client_To_Server__User__PATCH) => patch__user(axiosPrivate, json), 
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
		mutationFn: (session_id: number) => delete__session(axiosPrivate, session_id),
		onSuccess: ( _, session_id ) => {
			query_client.setQueryData([ 'session', 'list' ], (list_sessions: Array<Type__Session>) => list_sessions.filter(session => session.id !== session_id))
		}, 
		onError: err => {
			handle_error({
				err, 
				handle_404: () => {
					alert(t('session_not_found'))
					window.location.reload()
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

	const checkbox_click = ( index: number, checked: boolean ) => {

		setList_sessions(prev => {
			const tmp = [ ...prev ]
			tmp[index].Checkbox_Checked_To_Delete = checked
			return tmp
		})

	}





	// __________________________________________________ Universal Loader __________________________________________________

	const { setLoading__universal_loader } = useContext<Type__Context__Universal_Loader>(Context__Universal_Loader)
	useEffect(() => setLoading__universal_loader(isLoading__user || isLoading__list_sessions || mutate__change_order?.isPending), [ setLoading__universal_loader, isLoading__user, isLoading__list_sessions, mutate__change_order?.isPending ])





	return <>

		<OptionsDialog user={user}/>





		{/* __________________________________________________ Page __________________________________________________ */}

		<div className='session__select'>
			
			<header>

				<button 
					ref={ref}
					className='button button_reverse button_scale_3'
					onClick={() => setShow_settings(true)}
				><ListSort/></button>

				<button
					className={`button button_reverse trashcan${list_sessions?.length === 0 ? ' notvisible' : (!mutate__delete.isPending && list_sessions.some?.(session => session.Checkbox_Checked_To_Delete) ? ' button_scale_3 button_reverse_red' : ' disabled')}`}
					onClick={handle_delete} 
				><Trashcan/></button>

			</header>





			{/* __________________________________________________ No session in list __________________________________________________ */}

			{!isLoading__list_sessions && list_sessions?.length === 0 && <h1 className='no-game'>Es gibt noch keine Partie!</h1>}



			{/* __________________________________________________ Session list __________________________________________________ */}

			{!isLoading__list_sessions && list_sessions?.length !== 0 && <>

				<dl>
					{list_sessions.map?.((session, index_session) => (
						<dt 
							key={index_session}
							style={{ 
								backgroundColor: session.Color + '70', 
								border: '2px solid', 
								borderColor: session.Color + '90', 
							}}
						>

							<input 
								className='button-responsive'
								type='checkbox' 
								checked={session.Checkbox_Checked_To_Delete}
								onChange={({ target }) => !mutate__delete.isPending && checkbox_click(index_session, target.checked)} 
							/>

							{session.List__Players && <>
								<Link to={`/session/${session.id}/${session.List__Players.length === 0 ? 'players' : 'preview'}`}>

									<label className='names'>
										{(user?.Show__Session_Names || session.List__Players.length === 0) && session.Name}
										{!user?.Show__Session_Names && session.List__Players.length > 0 && session.List__Players.map(p => p.Name).join(' vs ')}
									</label>

									{user?.Show__Session_Date && <label className='date'>{formatDate(session?.LastPlayed || new Date())}</label>}

								</Link>
							</>}

						</dt>
					))}
				</dl>

			</>}





			<Custom_Link 
				onClick={() => navigate('/session', { replace: false })}
				text={t('create_session')}
			/>

		</div>
		




		<Popup__Dropdown
			target_ref={ref}
			show_popup={show_settings}
			setShow_popup={setShow_settings}
			className='session__select--popup--settings'
			alignLeft={true}
		>
			
			<div className='session__select--popup--settings--show'>
				{mutate__show_session_names.isPending && <LoaderBox dark={true} className='session__select--popup--settings--show--loader'/>}
				{!mutate__show_session_names.isPending && <>
					<input 
						onChange={() => mutate__show_session_names.mutate()}
						checked={user?.Show__Session_Names} 
						ref={ref___show__session_names}
						type='checkbox' 

					/>
				</>}
				<span onClick={() => ref___show__session_names.current?.click()}>{t('show_session_name')}</span>
			</div>
			<div className='session__select--popup--settings--show'>
				{mutate__show_session_date.isPending && <LoaderBox dark={true} className='session__select--popup--settings--show--loader'/>}
				{!mutate__show_session_date.isPending && <>
					<input 
						onChange={() => mutate__show_session_date.mutate()}
						checked={user?.Show__Session_Date} 
						ref={ref___show__session_date}
						type='checkbox' 
					/>
				</>}
				<span onClick={() => ref___show__session_date.current?.click()}>{t('show_date')}</span>
			</div>

			{list_orderOptions.map(option => {
				const cs = user?.View__Sessions === option.Alias
				const desc = user?.View__Sessions_Desc

				return (
					<button 
						key={option?.Text}
						onClick={() => change_order(option.Alias)}
						className={`button button_reverse${cs ? ' session__select--popup--settings--currently_selected' : ''}${desc ? ' session__select--popup--settings--desc' : ''}`}
					>
						{option.Text}
						<ArrowDown/>
					</button>
				)
				
			})}

		</Popup__Dropdown>

	</>
}
