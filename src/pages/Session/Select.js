

import './scss/Select.scss'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '../../logic/utils'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from '../../components/others/Popup'
import Loader from '../../components/Loader/Loader'
import CustomButton from '../../components/others/Custom_Button'
import OptionsDialog from '../../components/others/OptionsDialog'
import CustomLink from '../../components/NavigationElements/CustomLink'
import DragAndDropNameColorList from '../../components/others/DragAndDropNameColorList'





export default function SelectSession() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ list, setList ] = useState([])
	const [ list_checkbox ] = useState([])
	const [ trashcanDisabled, setTrashcanDisabled ] = useState(true)
	const [ settingsDisabled, setSettingsDisabled ] = useState(true)
	const [ listDisabled, setListDisabled ] = useState(false)

	const [ session, setSession ] = useState('')
	const [ list_players, setList_players ] = useState([])
	const [ successfullyUpdatedVisible, setSuccessfullyUpdatedVisible ] = useState(false)
	
	const [ loaderVisible, setLoaderVisible ] = useState(false)
	const [ loading_edit, setLoading_edit ] = useState(false)

	const [ show_editSession, setShow_editSession ] = useState(false)
	const [ show_deleteSession, setShow_deleteSession ] = useState(false)





	useEffect(() => {
		
		setLoaderVisible(true)

		axiosPrivate.get('/session/select').then((res) => {

			const l = res.data
			l.sort((a, b) => new Date(b.LastPlayed) - new Date(a.LastPlayed))
			setList(l)

		}).catch((err) => {

			handle_error({ err })

		}).finally(() => { setLoaderVisible(false) })

	}, [])

	const getPlayer = (alias) => {

		for(const p of session?.List_Players) {
			if(p.Alias === alias) {
				return p
			}
		}

	}
	




	// __________________________________________________ ListElement __________________________________________________

	const listElementClick = async (element) => {
		
		if(listDisabled) return

		setListDisabled(true)
		setLoaderVisible(true)
		const i = element.target.closest('dt').getAttribute('index')

		axiosPrivate.post('/session/select', { SessionID: list[i].id }).then(({ data }) => {

			if(data.Exists) {
				navigate(`/game?session_id=${list[i].id}&joincode=${data.JoinCode}`, { replace: true })
			} else {
				navigate(`/session/preview?session_id=${list[i].id}`, { replace: false })
			}

		}).catch((err) => {

			handle_error({ err })

		}).finally(() => {
			setLoaderVisible(false)
			setListDisabled(false)
		})

	}

	const checkboxClick = (index, checked) => {

		list_checkbox[index] = checked

		let counter = 0
		for(let i = 0; list_checkbox.length > i; i++) {
			if(list_checkbox[i]) {
				counter++
				setSession(list[i])
			}
		}
		setSettingsDisabled(counter !== 1)

		if(checked) {
			setTrashcanDisabled(false)
		} else {
			for(const e of list_checkbox) {
				if(e) return
			}
			setTrashcanDisabled(true)
		}

	}





	// __________________________________________________ Modal-Delete __________________________________________________

	const [ loading_delete, setLoading_delete ] = useState(false)

	const handle_delete = async () => {

		setLoading_delete(true)

		for(let i = 0; list_checkbox.length > i; i++) {
			if(list_checkbox[i]) {
				
				localStorage.removeItem(`kniffel_sessionpreview_${list[i].id}_view`)
				localStorage.removeItem(`kniffel_sessionpreview_${list[i].id}_month`)
				localStorage.removeItem(`kniffel_sessionpreview_${list[i].id}_year`)

				await axiosPrivate.delete(`/session/select?session_id=${list[i].id}`).catch((err) => { handle_error({ err }) })

			}
		}

		setLoading_delete(false)
		window.location.reload()

	}





	// __________________________________________________Modal-Edit__________________________________________________

	const [ columns, setColumns ] = useState('')
	const maxColumns = process.env.REACT_APP_MAX_COLUMNS || 10
	const options_columns = Array.from({ length: maxColumns }, (_, index) => index + 1)

	const handle_edit_columnChange = (event) => {

		const intValue = event.target.value
		if (isNaN(parseInt(intValue.substr(intValue.length - 1))) || intValue < 1 || parseInt(intValue) > maxColumns) {return setColumns(intValue.slice(0, -1))}
		setColumns(intValue)

	}

	const edit_show = () => {

		setSuccessfullyUpdatedVisible(false)
		setList_players(session?.List_PlayerOrder.map((alias) => getPlayer(alias)))
		setShow_editSession(true)

	}

	const edit_close = () => {
		
		setList_players([])
		setColumns('')
		setShow_editSession(false)

	}

	const edit_save = async () => {

		setLoading_edit(true)

		axiosPrivate.post('/session/update', { SessionID: session.id, Columns: +columns, List_Players: list_players }).then(() => {

			setSuccessfullyUpdatedVisible(true)
			edit_close()
			window.location.reload()

		}).catch((err) => {

			handle_error({ err, 
				handle_404: (() => {
					window.alert('Die Session wurde nicht gefunden!')
					window.location.reload()
				})
			})

		}).finally(() => { setLoading_edit(false) })		

	}





	return (
		<>

			{/* __________________________________________________ Dialogs __________________________________________________ */}

			<OptionsDialog/>





			{/* __________________________________________________ Page __________________________________________________ */}

			<div className='select_container'>

				<header>

					<svg 
						className={`trashcan ${list.length === 0 ? 'notvisible' : (trashcanDisabled ? 'disabled' : 'button-responsive')}`} 
						onClick={() => !trashcanDisabled && setShow_deleteSession(true)} 
						viewBox='-0.5 -0.5 458 510'
					><g><rect x='58' y='55' width='340' height='440' rx='51' ry='51' fill='none' strokeWidth='30' pointerEvents='all'/><rect x='15' y='55' width='427' height='30' rx='4.5' ry='4.5' fill='none' strokeWidth='30' pointerEvents='all'/><rect x='125' y='145' width='50' height='280' rx='9' ry='9' fill='none' strokeWidth='50' pointerEvents='all'/><rect x='275' y='145' width='50' height='280' rx='9' ry='9' fill='none' strokeWidth='50' pointerEvents='all'/><rect x='158' y='15' width='142' height='30' rx='4.5' ry='4.5' fill='none' strokeWidth='30' pointerEvents='all'/></g></svg>

					<Loader loaderVisible={loaderVisible}/>

					<svg 
						className={`edit ${list.length === 0 ? 'notvisible' : (settingsDisabled ? 'disabled' : 'button-responsive')}`} 
						onClick={edit_show} 
						viewBox='0 -960 960 960'
					><path d='M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z'/></svg>

				</header>



				<div className={`successfully-saved ${successfullyUpdatedVisible ? '' : 'notvisible'}`}>
					<p>Erfolgreich gespeichert!</p>
				</div>



				{list.length === 0 ? <>

					<h1 className='no-game'>Es gibt noch keine Partie!</h1>

				</>:<>

					<dl>
						{list.map((s, i) => (
							<dt index={i} key={i}>

								<input 
									className='button-responsive'
									type='checkbox' 
									onChange={(e) => checkboxClick(i, e.target.checked)} 
								/>

								<div onClick={listElementClick}>

									<label className='names'>
										{s.List_PlayerOrder.map((alias) => {
											
											for(const p of s.List_Players) {
												if(alias === p.Alias) {
													return p.Name
												}
											}
											return ''
										}).join(' vs ')}
									</label>

									<label className='date'>{formatDate(s.LastPlayed)}</label>

								</div>

							</dt>
						))}
					</dl>

				</>}



				<CustomLink 
					onClick={() => navigate('/game/create', { replace: false })}
					text='Erstelle Spiel'
				/>

			</div>

			



			{/* __________________________________________________ Popup Delete __________________________________________________ */}
			
			<Popup
				showPopup={show_deleteSession}
				setShowPopup={setShow_deleteSession}
			>
				<div className='select_popup_delete'>
					
					<h1>Bist du sicher, dass du diese Session(s) löschen möchtest?</h1>

					<CustomButton
						text='Ja'
						loading={loading_delete}
						onClick={handle_delete}
					/>

					<button 
						className='button button-red-reverse' 
						onClick={() => setShow_deleteSession(false)}
					>Abbrechen</button>

				</div>
			</Popup>





			{/* __________________________________________________ Popup Edit __________________________________________________ */}

			<Popup
				showPopup={show_editSession}
				setShowPopup={setShow_editSession}
				title='Bearbeiten'
			>
				<div className='select_popup_edit'>							


					{/* ______________________________ Columns ______________________________ */}
					
					<div className='columns'>

						<label>Spalten</label>
						
						<select
							value={columns}
							onChange={handle_edit_columnChange}
						>
							<option value={session?.Columns}>
								{'Derzeit: ' + session?.Columns}
							</option>
							{options_columns.map((c) => (
								<option key={c} value={c}>{c}</option>
							))}
						</select>

					</div>



					{/* ______________________________ List ______________________________ */}
					
					{list_players && <DragAndDropNameColorList List_Players={list_players} setList_Players={setList_players}/>}



					<CustomButton
						loading={loading_edit}
						onClick={edit_save}
						text='Speichern'
					/>

				</div>
			</Popup>

		</>
	)
}
