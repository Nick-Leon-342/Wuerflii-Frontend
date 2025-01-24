

import './scss/Popup_Edit_Preview.scss'

import { format } from 'date-fns'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import LoaderBox from '../Loader/Loader_Box'
import PopupDropdown from './Popup_Dropdown'





export default function Popup_Edit_View({
	target_ref, 

	setShow_customDate, 
	
	setShow_popup, 
	show_popup, 

	setSession, 
	session, 

}) {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ loading, setLoading ] = useState(false)

	const list_months = [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ]





	const update_view = async ( view, view_month, view_year ) => { 

		setLoading(true)

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


		}).catch(err => {

			handle_error({
				err, 
				handle_404: () => {
					alert('Session nicht gefunden.')
					navigate(-1, { replace: false })
				}
			})

		}).finally(() => setLoading(false))

	}





	return <>
		<PopupDropdown
			target_ref={target_ref}
			show_popup={show_popup}
			setShow_popup={setShow_popup}
			alignLeft={true}
			className='popup_edit_preview'
		>		
			{loading && <LoaderBox className='popup_edit_preview_select-loader' dark={true}/>}

			{!loading && <>
				<div className='popup_edit_preview_select'>

					{/* __________________________________________________ Year __________________________________________________ */}

					{(session?.View === 'show_month' || session?.View === 'show_year') && <>
						<div className='popup_edit_preview_select-container year'>
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
						<div className='popup_edit_preview_select-container month'>
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

					{session?.View === 'show_custom_date' && <>
						<div className='popup_edit_preview_select-container custom_date'>
							<span>Ansicht ab:</span>

							<button 
								onClick={() => setShow_customDate(true)}
								className='button button-reverse'
							>
								{`${format(new Date(session?.View_CustomDate), 'dd.MM.yyyy')}` || 'Erstelle Ansicht'}
							</button>
						</div>
					</>}



					{/* __________________________________________________ View __________________________________________________ */}

					<div className='popup_edit_preview_select-container view'>
						<select 
							value={session?.View}
							onChange={({ target }) => update_view(target.value, session.View_Month, session.View_Year)}
						>
							<option key={0} value='show_all'>Gesamtansicht</option>
							<option key={1} value='show_year'>Jahresansicht</option>
							<option key={2} value='show_month'>Monatsansicht</option>
							<option key={3} value='show_custom_date'>Benutzerdefiniert</option>
						</select>
					</div>

				</div>
			</>}
		</PopupDropdown>
	</>
}
