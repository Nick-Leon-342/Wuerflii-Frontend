

import './scss/Select.scss'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '../../logic/utils'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Loader from '../../components/Loader/Loader'
import OptionsDialog from '../../components/Popup/Popup_Options'
import CustomLink from '../../components/NavigationElements/CustomLink'





export default function SelectSession() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ user, setUser ] = useState()
	const [ loading, setLoading ] = useState(false)
	const [ list_sessions, setList_sessions ] = useState()	





	useEffect(() => {
		
		setLoading(true)

		axiosPrivate.get('/session/all').then(({ data }) => {

			
			setUser(data.User)
			setList_sessions(data.List_Sessions.map(s => {
				return {
					...s, 
					Checkbox_Checked: false, 
				}
			}))


		}).catch((err) => {

			handle_error({ 
				err, 
				handle_404: () => {
					alert('Benutzer nicht gefunden.')
					navigate('/', { replace: true })
				}
			})

		}).finally(() => setLoading(false))

		// eslint-disable-next-line
	}, [])

	const checkbox_click = ( index, checked ) => {

		setList_sessions(prev => {
			const tmp = [ ...prev ]
			tmp[index].Checkbox_Checked = checked
			return tmp
		})

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





	return (
		<>

			<OptionsDialog
				user={user}
				setUser={setUser}
			/>





			{/* __________________________________________________ Page __________________________________________________ */}

			<div className='select_container'>

				<header>

					<button 
						className='button button-reverse button-responsive'
						onClick={() => console.log()}
					><svg viewBox='0 -960 960 960'><path d='M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z'/></svg></button>

					{!loading && 
						<button
							className={`button button-reverse trashcan${list_sessions?.length === 0 ? ' notvisible' : (!loading_delete && list_sessions?.some(s => s.Checkbox_Checked) ? ' button-responsive' : ' disabled')}`}
							onClick={handle_delete} 
						><svg viewBox='-0.5 -0.5 458 510'><g><rect x='58' y='55' width='340' height='440' rx='51' ry='51' fill='none' strokeWidth='30' pointerEvents='all'/><rect x='15' y='55' width='427' height='30' rx='4.5' ry='4.5' fill='none' strokeWidth='30' pointerEvents='all'/><rect x='125' y='145' width='50' height='280' rx='9' ry='9' fill='none' strokeWidth='50' pointerEvents='all'/><rect x='275' y='145' width='50' height='280' rx='9' ry='9' fill='none' strokeWidth='50' pointerEvents='all'/><rect x='158' y='15' width='142' height='30' rx='4.5' ry='4.5' fill='none' strokeWidth='30' pointerEvents='all'/></g></svg></button>
					}

					<Loader loading={loading}/>

				</header>
				




				{list_sessions?.length === 0 ? <>

					<h1 className='no-game'>Es gibt noch keine Partie!</h1>

				</>:<>

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

								<div onClick={() => !loading_delete && navigate(`/session/preview?session_id=${session.id}`, { replace: false })}>

									<label className='names'>
										{session.List_Players.map(p => p.Name).join(' vs ')}
									</label>

									<label className='date'>{formatDate(session.LastPlayed)}</label>

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

		</>
	)
}
