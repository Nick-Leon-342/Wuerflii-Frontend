

import './scss/Popup__Edit_Preview.scss'

import { useEffect, useState, type RefObject } from 'react'
import { format } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import LoaderBox from '../Loader/Loader_Box'
import Popup__Dropdown from './Popup__Dropdown'

import { patch__session } from '../../api/session/session'

import type { Type__Session } from '../../types/Type__Session'
import type { Enum__View } from '../../types/Enum/Enum__View'
import type { Enum__Month } from '../../types/Enum/Enum__Month'
import type { Type__Client_To_Server__Session__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session__PATCH'





interface Props__Popup__Edit_Preview {
	target_ref:			RefObject<HTMLButtonElement | null>
	setShow_customDate:	React.Dispatch<React.SetStateAction<boolean>>
	setShow_popup:		React.Dispatch<React.SetStateAction<boolean>>
	show_popup:			boolean

	setSession:			React.Dispatch<React.SetStateAction<Type__Session | undefined>>
	session:			Type__Session
	refetch:			() => void
}

export default function Popup__Edit_Preview({
	target_ref, 

	setShow_customDate, 
	
	setShow_popup, 
	show_popup, 

	setSession, 
	session, 
	refetch, 
}: Props__Popup__Edit_Preview) {

	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ view,		setView			] = useState<Enum__View>('SHOW__ALL')
	const [ view_month, setView_month	] = useState<Enum__Month>(1)
	const [ view_year, 	setView_year	] = useState<number>(0)

	const list_months = [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ]

	useEffect(() => {
		function init() {
			if(!session) return 
			setView(session.View)
			setView_month(session.View__Month)
			setView_year(session.View__Year)
		}
		init()
	}, [ session ])





	const mutate__session = useMutation({
		mutationFn: (json: Type__Client_To_Server__Session__PATCH) => patch__session(axiosPrivate, json), 
		onSuccess: (_, json) => {
			setSession(prev => {
				if(!prev) return prev
				const tmp 		= { ...prev }
				tmp.View 		= json.View || 'SHOW__ALL'
				tmp.View__Month 	= json.View__Month || 1
				tmp.View__Year 	= json.View__Year || 0
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

	function update_view(
		view:		Enum__View, 
		view_month:	Enum__Month, 
		view_year:	number
	): void {

		mutate__session.mutate({
			SessionID:	session.id, 
			View:		view, 
			View__Month: view_month, 
			View__Year: 	view_year, 
		})

	}





	return <>
		<Popup__Dropdown
			target_ref={target_ref}
			show_popup={show_popup}
			setShow_popup={setShow_popup}
			alignLeft={true}
			className='popup__edit_preview'
		>		
			{mutate__session.isPending && <LoaderBox className='popup__edit_preview--select_loader' dark={true}/>}

			<div className='popup__edit_preview--select'>

				{/* __________________________________________________ Year __________________________________________________ */}

				{(view === 'SHOW__MONTH' || view === 'SHOW__YEAR') && <>
					<div className='popup__edit_preview--select_container year'>
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

				{view === 'SHOW__MONTH' && <>
					<div className='popup__edit_preview--select_container month'>
						<span>Monat:</span>

						<select 
							value={view_month}
							onChange={({ target }) => update_view(view, +target.value as Enum__Month, view_year)}
						>
							{list_months.map((month, index_month) => 
								<option key={index_month} value={index_month + 1}>{month}</option>
							)}
						</select>
					</div>
				</>}



				{/* __________________________________________________ Custom_Date __________________________________________________ */}

				{view === 'SHOW__CUSTOM_DATE' && <>
					<div className='popup__edit_preview--select_container custom_date'>
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

				<div className='popup__edit_preview--select_container view'>
					<select 
						value={view}
						onChange={({ target }) => update_view(target.value as Enum__View, view_month, view_year)}
					>
						<option key={0} value='SHOW__ALL'>Gesamtansicht</option>
						<option key={1} value='SHOW__YEAR'>Jahresansicht</option>
						<option key={2} value='SHOW__MONTH'>Monatsansicht</option>
						<option key={3} value='SHOW__CUSTOM_DATE'>Benutzerdefiniert</option>
					</select>
				</div>

			</div>
		</Popup__Dropdown>
	</>
}
