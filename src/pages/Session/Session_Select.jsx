

import './scss/Session_Select.scss'

import { useNavigate } from 'react-router-dom'
import { formatDate } from '../../logic/utils'
import React, { useEffect, useRef, useState } from 'react'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Loader from '../../components/Loader/Loader'
import LoaderBox from '../../components/Loader/Loader_Box'
import OptionsDialog from '../../components/Popup/Popup_Options'
import PopupDropdown from '../../components/Popup/Popup_Dropdown'
import CustomLink from '../../components/NavigationElements/CustomLink'





export default function Session_Select({
	setError, 
}) {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const ref = useRef()

	const [ user, setUser ] = useState()
	const [ loading, setLoading ] = useState(false)
	const [ list_sessions, setList_sessions ] = useState() 

	const [ show_settings, setShow_settings ] = useState(false)

	const [ loading_show_session_names, setLoading_show_session_names ] = useState(false)
	const [ loading_show_session_date, setLoading_show_session_date ] = useState(false)
	const [ loading_change_order, setLoading_change_order ] = useState(false)
	const list_orderOptions = [
		{ Text: 'Zuletzt gespielt', 	Alias: 'Last_Played'	},
		{ Text: 'Erstellt', 			Alias: 'Created'		},
		{ Text: 'Name', 				Alias: 'Name'			},
	]

	const change_order = async ( selectedOption ) => {

		const alias = selectedOption.Alias
		const descending = alias === user?.View_Sessions ? !user.View_Sessions_Desc : true

		setLoading_change_order(true)

		axiosPrivate.patch('/user', {
			View_Sessions: alias, 
			View_Sessions_Desc: descending
		}).then(() => {

			setUser(prev => {
				const tmp = { ...prev }
				tmp.View_Sessions = alias
				tmp.View_Sessions_Desc = descending
				return tmp
			})

		}).catch((err) => {

			handle_error({ 
				err, 
			})

		}).finally(() => setLoading_change_order(false))

	}






	useEffect(() => {
		
		setLoading(true)

		axiosPrivate.get('/user').then(({ data }) => {

			setUser(data)

		}).catch((err) => {

			handle_error({ 
				err, 
			})

		}).finally(() => setLoading(false))

		// eslint-disable-next-line
	}, [])

	useEffect(() => {

		if(!user) return
		
		setLoading(true)

		axiosPrivate.get('/session/all').then(({ data }) => {

			setList_sessions(data.List_Sessions.map(s => {
				return {
					...s, 
					Checkbox_Checked: false, 
				}
			}))


		}).catch((err) => {

			handle_error({ 
				err, 
			})

		}).finally(() => setLoading(false))

		// eslint-disable-next-line
	}, [ user?.View_Sessions, user?.View_Sessions_Desc ])

	const select = ( session ) => {

		if(loading_delete) return setError('Warte bitte, bis das Löschen vollständig durchgeführt wurde.')

		if(session.List_Players.length === 0) {
			navigate(`/session/${session.id}/players`, { replace: false })
		} else {
			navigate(`/session/${session.id}/preview`, { replace: false })
		}
	}

	const checkbox_click = ( index, checked ) => {

		setList_sessions(prev => {
			const tmp = [ ...prev ]
			tmp[index].Checkbox_Checked = checked
			return tmp
		})

	}

	const change_show_session_names = () => {

		setLoading_show_session_names(true)

		axiosPrivate.patch('/user', { Show_Session_Names: !user.Show_Session_Names }).then(() => {

			setUser(user => {
				const tmp = { ...user }
				tmp.Show_Session_Names = !tmp.Show_Session_Names
				return tmp
			})

		}).catch(err => {

			handle_error({
				err, 
			})

		}).finally(() => setLoading_show_session_names(false))

	}

	const change_show_session_date = () => {

		setLoading_show_session_date(true)

		axiosPrivate.patch('/user', { Show_Session_Date: !user.Show_Session_Date }).then(() => {

			setUser(user => {
				const tmp = { ...user }
				tmp.Show_Session_Date = !tmp.Show_Session_Date
				return tmp
			})

		}).catch(err => {

			handle_error({
				err, 
			})

		}).finally(() => setLoading_show_session_date(false))

	}





	// __________________________________________________ Delete __________________________________________________

	const [ loading_delete, setLoading_delete ] = useState(false)

	const handle_delete = async () => {

		if(!window.confirm(`Bist du sicher, dass du diese Session${list_sessions?.filter(s => s.Checkbox_Checked).length > 1 ? '(s)' : ''} löschen willst?`)) return

		setLoading_delete(true)

		for(const session of list_sessions) { if(session.Checkbox_Checked) {
				
			await axiosPrivate.delete(`/session?session_id=${session.id}`).then(() => {

				setList_sessions(prev => {
					const tmp = []
					for(const s of prev) {if(s.id !== session.id) tmp.push(s)}
					return tmp
				})

			}).catch((err) => {
			
				handle_error({ 
					err, 
					handle_404: () => {
						alert(`Die Session '${session.Name}' konnte nicht mehr auf dem Server gefunden werden. Die Seite wird jetzt automatisch neu geladen.`)
						window.location.reload()
					}
				})
			
			})

		}}

		setLoading_delete(false)

	}





	return <>

		<OptionsDialog
			user={user}
			setUser={setUser}
		/>





		{/* __________________________________________________ Page __________________________________________________ */}

		<div className='session_select'>

			<header>

				<button 
					ref={ref}
					className='button button-reverse button-responsive'
					onClick={() => setShow_settings(true)}
				><svg viewBox='0 -960 960 960'><path d='M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z'/></svg></button>

				{!loading && 
					<button
						className={`button button-reverse trashcan${list_sessions?.length === 0 ? ' notvisible' : (!loading_delete && list_sessions?.some(s => s.Checkbox_Checked) ? ' button-responsive' : ' disabled')}`}
						onClick={handle_delete} 
					><svg viewBox='-0.5 -0.5 458 510'><g><rect x='58' y='55' width='340' height='440' rx='51' ry='51' fill='none' strokeWidth='30' pointerEvents='all'/><rect x='15' y='55' width='427' height='30' rx='4.5' ry='4.5' fill='none' strokeWidth='30' pointerEvents='all'/><rect x='125' y='145' width='50' height='280' rx='9' ry='9' fill='none' strokeWidth='50' pointerEvents='all'/><rect x='275' y='145' width='50' height='280' rx='9' ry='9' fill='none' strokeWidth='50' pointerEvents='all'/><rect x='158' y='15' width='142' height='30' rx='4.5' ry='4.5' fill='none' strokeWidth='30' pointerEvents='all'/></g></svg></button>
				}

				<Loader loading={loading}/>

			</header>
			




			{list_sessions?.length === 0 && <h1 className='no-game'>Es gibt noch keine Partie!</h1>}

			{list_sessions?.length !== 0 && <>

				<dl>
					{list_sessions?.map((session, index_session) => (
						<dt 
							key={index_session}
							style={{ backgroundColor: session.Color + '70' }}
						>

							<input 
								className='button-responsive'
								type='checkbox' 
								checked={session.Checkbox_Checked}
								onChange={({ target }) => !loading_delete && checkbox_click(index_session, target.checked)} 
							/>

							<div onClick={() => select(session)}>

								<label className='names'>
									{(user?.Show_Session_Names || session.List_Players.length === 0) && session.Name}
									{!user?.Show_Session_Names && session.List_Players.length > 0 && session.List_Players.map(p => p.Name).join(' vs ')}
								</label>

								{user?.Show_Session_Date && <label className='date'>{formatDate(session.LastPlayed)}</label>}

							</div>

						</dt>
					))}
				</dl>

			</>}



			<CustomLink 
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
				{loading_show_session_names && <LoaderBox dark={true} className='session_select_popup_settings-show-loader'/>}
				{!loading_show_session_names && <input type='checkbox' checked={user?.Show_Session_Names} onChange={change_show_session_names}/>}
				<span>Partienamen anzeigen</span>
			</div>
			<div className='session_select_popup_settings-show'>
				{loading_show_session_date && <LoaderBox dark={true} className='session_select_popup_settings-show-loader'/>}
				{!loading_show_session_date && <input type='checkbox' checked={user?.Show_Session_Date} onChange={change_show_session_date}/>}
				<span>Datum anzeigen</span>
			</div>

			{list_orderOptions.map((option, i) => {
				const cs = user?.View_Sessions === option.Alias
				const desc = user?.View_Sessions_Desc

				return <>
					<button 
						key={i}
						className={`button button-reverse${cs ? ' session_select_popup_settings-currently_selected' : ''}${desc ? ' session_select_popup_settings-desc' : ''}`}
						onClick={() => change_order(option)}
					>
						{option.Text}
						<svg  viewBox='0 -960 960 960'><path d='M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z'/></svg>
					</button>
				</>
			})}

			<Loader loading={loading_change_order}/>

		</PopupDropdown>

	</>
}
