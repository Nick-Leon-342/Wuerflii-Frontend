

import './scss/Session_Select.scss'

import { formatDate } from '../../logic/utils'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'
import Context__Universal_Loader from '../../Provider_And_Context/Provider_And_Context__Universal_Loader'

import LoaderBox from '../../components/Loader/Loader_Box'
import OptionsDialog from '../../components/Popup/Popup_Options'
import PopupDropdown from '../../components/Popup/Popup_Dropdown'
import Custom_Link from '../../components/NavigationElements/Custom_Link'

import Trashcan from '../../svg/Trashcan.svg'
import ListSort from '../../svg/List_Sort.svg'
import ArrowDown from '../../svg/Arrow_Down.svg'

import { get__user, patch__user } from '../../api/user'
import { delete__session, get__sessions_list } from '../../api/session/session'
import type { Type__Context__Universal_Loader } from '../../types/Type__Context/Type__Context__Universal_Loader'





export default function Session__Select() {

	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const ref = useRef()

	const [ list_sessions, setList_sessions ] = useState([]) 

	const [ show_settings, setShow_settings ] = useState(false)
	const list_orderOptions = [
		{ Text: 'Zuletzt gespielt', 	Alias: 'Last_Played'	},
		{ Text: 'Erstellt', 			Alias: 'Created'		},
		{ Text: 'Name', 				Alias: 'Name'			},
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

		// List_Session is edited only in frontend (checkbox to delete multiple sessions), that's why the read-only tmp_list_sessions has to be copied into a editable variable
		setList_sessions(tmp_list_sessions || [])

		if(!tmp_list_sessions) return 
		// Cache all sessions and players to increase performance when selecting session
		for(const session of tmp_list_sessions) {
			query_client.setQueryData([ 'session', session.id ], session)
			query_client.setQueryData([ 'session', session.id, 'players' ], session.List_Players)
		}

		// eslint-disable-next-line
	}, [ tmp_list_sessions ])





	// __________________________________________________ Change List __________________________________________________

	const mutate__show_session_date = useMutation({
		mutationFn: () => patch__user(axiosPrivate, { Show_Session_Date: !user.Show_Session_Date }), 
		onSuccess: () => {
			query_client.setQueryData([ 'user' ], { ...user, Show_Session_Date: !user.Show_Session_Date })
		}, 
		onError: err => {
			handle_error({
				err, 
			})
		}
	})

	const mutate__show_session_names = useMutation({
		mutationFn: () => patch__user(axiosPrivate, { Show_Session_Names: !user.Show_Session_Names }), 
		onSuccess: () => {
			query_client.setQueryData([ 'user' ], { ...user, Show_Session_Names: !user.Show_Session_Names })
		}, 
		onError: err => {
			handle_error({
				err, 
			})
		}
	})

	const mutate__change_order = useMutation({
		mutationFn: json => patch__user(axiosPrivate, json), 
		onSuccess: ( _, json ) => {
			query_client.setQueryData([ 'user' ], { ...user, ...json })
			query_client.invalidateQueries([ 'session', 'list' ], { exact: true })
		}, 
		onError: err => {
			handle_error({
				err, 
			})
		}
	})

	const change_order = async selected_option => {

		const alias = selected_option.Alias
		const descending = alias === user?.View_Sessions ? !user.View_Sessions_Desc : true

		mutate__change_order.mutate({
			View_Sessions: alias, 
			View_Sessions_Desc: descending
		})

	}





	// __________________________________________________ Delete __________________________________________________

	const mutate__delete = useMutation({
		mutationFn: session_id => delete__session(axiosPrivate, session_id),
		onSuccess: ( _, session_id ) => {
			query_client.setQueryData([ 'session', 'list' ], list_sessions => list_sessions.filter(session => session.id !== session_id))
		}, 
		onError: err => {
			handle_error({
				err, 
				handle_404: () => {
					alert('Die Partie wurde nicht gefunden.')
					window.location.reload()
				}
			})
		}
	})

	const handle_delete = async () => {

		if(!window.confirm(`Sicher, dass du diese Session${list_sessions?.filter(s => s.Checkbox_Checked).length > 1 ? '(s)' : ''} löschen willst?`)) return

		for(const session of list_sessions) { if(session.Checkbox_Checked) {

			mutate__delete.mutate(session.id)

		}}

	}





	// __________________________________________________ Select Checkbox __________________________________________________

	const checkbox_click = ( index, checked ) => {

		setList_sessions(prev => {
			const tmp = [ ...prev ]
			tmp[index].Checkbox_Checked = checked
			return tmp
		})

	}





	// __________________________________________________ Universal Loader __________________________________________________

	const { setLoading__universal_loader } = useContext<Type__Context__Universal_Loader>(Context__Universal_Loader)
	useEffect(() => setLoading__universal_loader(isLoading__user || isLoading__list_sessions || mutate__change_order?.isPending), [ setLoading__universal_loader, isLoading__user, isLoading__list_sessions, mutate__change_order?.isPending ])





	return <>

		<OptionsDialog user={user}/>





		{/* __________________________________________________ Page __________________________________________________ */}

		<div className='session_select'>
			
			<header>

				<button 
					ref={ref}
					className='button button_reverse button_scale_3'
					onClick={() => setShow_settings(true)}
				><ListSort/></button>

				<button
					className={`button button_reverse trashcan${list_sessions?.length === 0 ? ' notvisible' : (!mutate__delete.isPending && list_sessions?.some(session => session.Checkbox_Checked) ? ' button_scale_3 button_reverse_red' : ' disabled')}`}
					onClick={handle_delete} 
				><Trashcan/></button>

			</header>





			{/* __________________________________________________ No session in list __________________________________________________ */}

			{!isLoading__list_sessions && list_sessions?.length === 0 && <h1 className='no-game'>Es gibt noch keine Partie!</h1>}



			{/* __________________________________________________ Session list __________________________________________________ */}

			{!isLoading__list_sessions && list_sessions?.length !== 0 && <>

				<dl>
					{list_sessions?.map((session, index_session) => (
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
								checked={session.Checkbox_Checked}
								onChange={({ target }) => !mutate__delete.isPending && checkbox_click(index_session, target.checked)} 
							/>

							<Link to={`/session/${session.id}/${session.List_Players.length === 0 ? 'players' : 'preview'}`}>

								<label className='names'>
									{(user?.Show_Session_Names || session.List_Players.length === 0) && session.Name}
									{!user?.Show_Session_Names && session.List_Players.length > 0 && session.List_Players.map(p => p.Name).join(' vs ')}
								</label>

								{user?.Show_Session_Date && <label className='date'>{formatDate(session.LastPlayed)}</label>}

							</Link>

						</dt>
					))}
				</dl>

			</>}





			<Custom_Link 
				onClick={() => navigate('/session', { replace: false })}
				text='Spiel erstellen'
			/>

		</div>
		




		<PopupDropdown
			target_ref={ref}
			show_popup={show_settings}
			setShow_popup={setShow_settings}
			className='session_select_popup_settings'
			alignLeft={true}
		>
			
			<div className='session_select_popup_settings-show'>
				{mutate__show_session_names.isPending && <LoaderBox dark={true} className='session_select_popup_settings-show-loader'/>}
				{!mutate__show_session_names.isPending && <input type='checkbox' checked={user?.Show_Session_Names} onChange={() => mutate__show_session_names.mutate()}/>}
				<span>Partienamen anzeigen</span>
			</div>
			<div className='session_select_popup_settings-show'>
				{mutate__show_session_date.isPending && <LoaderBox dark={true} className='session_select_popup_settings-show-loader'/>}
				{!mutate__show_session_date.isPending && <input type='checkbox' checked={user?.Show_Session_Date} onChange={() => mutate__show_session_date.mutate()}/>}
				<span>Datum anzeigen</span>
			</div>

			{list_orderOptions.map(option => {
				const cs = user?.View_Sessions === option.Alias
				const desc = user?.View_Sessions_Desc

				return (
					<button 
						key={option?.Text}
						onClick={() => change_order(option)}
						className={`button button_reverse${cs ? ' session_select_popup_settings-currently_selected' : ''}${desc ? ' session_select_popup_settings-desc' : ''}`}
					>
						{option.Text}
						<ArrowDown/>
					</button>
				)
				
			})}

		</PopupDropdown>

	</>
}
