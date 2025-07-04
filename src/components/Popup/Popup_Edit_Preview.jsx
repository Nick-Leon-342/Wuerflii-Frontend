

import './scss/Popup_Edit_Preview.scss'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import LoaderBox from '../Loader/Loader_Box'
import PopupDropdown from './Popup_Dropdown'

import { patch__session } from '../../api/session/session'





/**
 * 
 * Popup_Edit_View Component
 *
 * This component provides a popup interface for editing and selecting different views.
 *
 * @param {Object} props - Component properties
 * @param {React.RefObject} props.target_ref - Reference to the target element
 * @param {Function} props.setShow_customDate - Function to show the custom date selection
 * @param {Function} props.setShow_popup - Function to toggle the popup visibility
 * @param {boolean} props.show_popup - Controls the visibility of the popup
 * @param {Function} props.refetch - Function to refetch final_scores
 * @param {Function} props.setSession - Function to set session data
 * @param {Object} props.session - Current session data
 * 
 */

export default function Popup_Edit_View({
	target_ref, 

	setShow_customDate, 
	
	setShow_popup, 
	show_popup, 

	setSession, 
	session, 
	refetch, 
}) {

	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ view, setView ] = useState()
	const [ view_month, setView_month ] = useState()
	const [ view_year, setView_year ] = useState()

	const list_months = [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ]

	useEffect(() => {

		if(!session) return 
		setView(session.View)
		setView_month(session.View_Month)
		setView_year(session.View_Year)

	}, [ session ])





	const mutate__session = useMutation({
		mutationFn: json => patch__session(axiosPrivate, json), 
		onSuccess: (_, json) => {
			setSession(prev => {
				const tmp = { ...prev }
				tmp.View = json.View
				tmp.View_Month = json.View_month
				tmp.View_Year = json.View_year
				query_client.setQueryData([ 'session', session.id ], tmp)
				return tmp
			})
			refetch()
		}, 
		onError: err => {
			handle_error({
				err, 
			})
		}
	})

	const update_view = async ( view, view_month, view_year ) => { 

		mutate__session.mutate({
			SessionID: session.id, 
			View: view, 
			View_Month: view_month, 
			View_Year: view_year, 
		})

	}





	return <>
		<PopupDropdown
			target_ref={target_ref}
			show_popup={show_popup}
			setShow_popup={setShow_popup}
			alignLeft={true}
			className='popup_edit_preview'
		>		
			{mutate__session.isPending && <LoaderBox className='popup_edit_preview_select-loader' dark={true}/>}

			<div className='popup_edit_preview_select'>

				{/* __________________________________________________ Year __________________________________________________ */}

				{(view === 'show_month' || view === 'show_year') && <>
					<div className='popup_edit_preview_select-container year'>
						<span>Jahr:</span>

						<select 
							value={view_year}
							onChange={({ target }) => update_view(view, view_month, +target.value)}
						>
							{session?.View_List_Years.map((y, i) => 
								<option key={i} value={y}>{y}</option>
							)}
						</select>
					</div>
				</>}


				
				{/* __________________________________________________ Month __________________________________________________ */}

				{view === 'show_month' && <>
					<div className='popup_edit_preview_select-container month'>
						<span>Monat:</span>

						<select 
							value={view_month}
							onChange={({ target }) => update_view(view, +target.value, view_year)}
						>
							{list_months.map((month, index_month) => 
								<option key={index_month} value={index_month + 1}>{month}</option>
							)}
						</select>
					</div>
				</>}



				{/* __________________________________________________ Custom_Date __________________________________________________ */}

				{view === 'show_custom_date' && <>
					<div className='popup_edit_preview_select-container custom_date'>
						<span>Ansicht ab:</span>

						<button 
							onClick={() => setShow_customDate(true)}
							className='button button_reverse button_scale_2'
						>
							{`${format(new Date(session?.View_CustomDate), 'dd.MM.yyyy')}` || 'Erstelle Ansicht'}
						</button>
					</div>
				</>}



				{/* __________________________________________________ View __________________________________________________ */}

				<div className='popup_edit_preview_select-container view'>
					<select 
						value={view}
						onChange={({ target }) => update_view(target.value, view_month, view_year)}
					>
						<option key={0} value='show_all'>Gesamtansicht</option>
						<option key={1} value='show_year'>Jahresansicht</option>
						<option key={2} value='show_month'>Monatsansicht</option>
						<option key={3} value='show_custom_date'>Benutzerdefiniert</option>
					</select>
				</div>

			</div>
		</PopupDropdown>
	</>
}
