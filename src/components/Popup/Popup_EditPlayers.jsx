

import './scss/Popup_EditPlayers.scss'

import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from './Popup'
import LoaderBox from '../Loader/Loader_Box'
import CustomButton from '../others/Custom_Button'
import DragAndDropNameColorList from '../others/DragAndDropNameColorList'





export default function Popup_EditPlayers({
	request_finalscores, 

	setShow_customDate, 

	setShow_editPlayers, 
	show_editPlayers, 

	setList_players, 
	list_players, 

	setSession, 
	session, 

	show_edit_customDate, 
}) {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ loading, setLoading ] = useState(false)
	const [ loading_update_view, setLoading_update_view ] = useState(false)

	const [ list_edit_players, setList_edit_players ] = useState()

	const [ MAX_LENGTH_PLAYER_NAME, setMAX_LENGTH_PLAYER_NAME ] = useState()

	const list_months = [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ]





	useEffect(() => {

		if(!show_edit_customDate) return

		setLoading(true)

		axiosPrivate.get('/game/create').then(({ data }) => {

			setMAX_LENGTH_PLAYER_NAME(data.MAX_LENGTH_PLAYER_NAME)

		}).catch(err => { 
			
			handle_error({ err }) 
		
		}).finally(() => setLoading(false))

		// eslint-disable-next-line
	}, [])

	useEffect(() => setList_edit_players(structuredClone(list_players)), [ list_players ])

	const update_view = async ( view, view_month, view_year ) => { 

		setLoading_update_view(true)

		await axiosPrivate.patch('/session', {
			SessionID: session.id, 
			View: view, 
			View_Month: view_month, 
			View_Year: view_year, 
		}).then(() => {


			setSession(prev => {
				const tmp = { ...prev }
				tmp.View = view
				tmp.View_Month = view_month
				tmp.View_Year = view_year
				return tmp
			})
			setShow_editPlayers(false)


		}).catch(err => {

			handle_error({
				err, 
				handle_404: () => {
					alert('Session nicht gefunden.')
					navigate('/session/select', { replace: false })
				}
			})

		}).finally(() => setLoading_update_view(false))

		request_finalscores(session)

	}

	const save = async () => {

		if(list_players === list_edit_players) return setShow_editPlayers(false)
		setLoading(true)

		axiosPrivate.patch('/player/list', { 
			SessionID: session.id, 
			List_Players: list_edit_players, 
		}).then(() => {

			setList_players(structuredClone(list_edit_players))
			setShow_editPlayers(false)

		}).catch((err) => {

			handle_error({ 
				err, 
				handle_404: (() => {
					alert('Die Session wurde nicht gefunden!')
					navigate('/session/select', { replace: true })
				})
			})

		}).finally(() => setLoading(false))		

	}





	return (<>
		<Popup
			showPopup={show_editPlayers}
			setShowPopup={setShow_editPlayers}
			title='Bearbeiten'
		>
			<div className='popup_editplayers'>		

				{show_edit_customDate && loading_update_view && <LoaderBox className='popup_editplayers_select-loader' dark={true}/>}

				{show_edit_customDate && !loading_update_view && <>
					<div className='popup_editplayers_select'>

						{/* __________________________________________________ Year __________________________________________________ */}

						{(session?.View === 'show_month' || session?.View === 'show_year') && <>
							<div className='popup_editplayers_select-container year'>
								<span>Jahr:</span>

								<select 
									value={session.View_Year}
									onChange={({ target }) => update_view(session.View, session.View_Month, +target.value)}
								>
									{session?.View_List_Years.map((y, i) => 
										<option key={i} value={y}>{y}</option>
									)}
								</select>
							</div>
						</>}


						
						{/* __________________________________________________ Month __________________________________________________ */}

						{session?.View === 'show_month' && <>
							<div className='popup_editplayers_select-container month'>
								<span>Monat:</span>

								<select 
									value={session.View_Month}
									onChange={({ target }) => update_view(session.View, +target.value, session.View_Year)}
								>
									{list_months.map((m, i) => 
										<option key={i} value={i+1}>{m}</option>
									)}
								</select>
							</div>
						</>}



						{/* __________________________________________________ Custom_Date __________________________________________________ */}

						{session?.View === 'custom_date' && <>
							<div className='popup_editplayers_select-container custom_date'>
								<span>Ansicht ab:</span>

								<button 
									onClick={() => setShow_customDate(true)}
									className='button button-reverse button-responsive'
								>
									{`${format(new Date(session?.CustomDate), 'dd.MM.yyyy')}` || 'Erstelle Ansicht'}
								</button>
							</div>
						</>}



						{/* __________________________________________________ View __________________________________________________ */}

						<div className='popup_editplayers_select-container view'>
							<select 
								value={session?.View}
								onChange={({ target }) => update_view(target.value, session.View_Month, session.View_Year)}
							>
								<option key={0} value='show_all'>Gesamtansicht</option>
								<option key={1} value='show_year'>Jahresansicht</option>
								<option key={2} value='show_month'>Monatsansicht</option>
								<option key={3} value='custom_date'>Benutzerdefiniert</option>
							</select>
						</div>

					</div>
				</>}


				
				{list_edit_players && <>
					<DragAndDropNameColorList
						list_edit_players={list_edit_players} 
						setList_edit_players={setList_edit_players}
						MAX_LENGTH_PLAYER_NAME={MAX_LENGTH_PLAYER_NAME}
					/>
				</>}



				<CustomButton
					loading={loading}
					text='Speichern'
					onClick={save}
				/>

			</div>
		</Popup>
	</>)
}
