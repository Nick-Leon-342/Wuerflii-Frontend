

import './css/SelectSession.css'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '../logic/utils'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { isMobile } from 'react-device-detect'
import Loader from '../components/Loader'
import DragAndDropNameColorList from '../components/DragAndDropNameColorList'
import OptionsDialog from '../components/Dialog/OptionsDialog'
import CustomLink from '../components/NavigationElements/CustomLink'
import Popup from '../components/Popup'





export default function SelectSession() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const [ list, setList ] = useState([])
	const [ list_checkbox ] = useState([])
	const [ trashcanDisabled, setTrashcanDisabled ] = useState(true)
	const [ settingsDisabled, setSettingsDisabled ] = useState(true)
	const [ listDisabled, setListDisabled ] = useState(false)

	const [ session, setSession ] = useState('')
	const [ tmpListPlayers, setTmpListPlayers ] = useState([])
	const [ loaderVisible, setLoaderVisible ] = useState(false)
	const [ dialog_loaderVisible, setDialog_loaderVisible ] = useState(false)
	const [ successfullyUpdatedVisible, setSuccessfullyUpdatedVisible ] = useState(false)

	const [ show_editSession, setShow_editSession ] = useState(false)
	const [ show_deleteSession, setShow_deleteSession ] = useState(false)





	useEffect(() => {
		request()
	}, [])

	async function request() {

		setLoaderVisible(true)

		await axiosPrivate.get('/selectsession').then((res) => {

			const l = res.data
			l.sort(sortByTimestampDesc)
			setList(l)

		}).catch((err) => {
			console.log(err)
			window.alert('Es trat ein unvorhergesehener Fehler auf!')
		})

		setLoaderVisible(false)

	}

	const sortByTimestampDesc = (a, b) => {
		return new Date(b.LastPlayed) - new Date(a.LastPlayed)
	}

	const getPlayer = (alias) => {

		for(const p of session?.List_Players) {
			if(p.Alias === alias) {
				return p
			}
		}

	}
	




	// __________________________________________________ListElement__________________________________________________

	const listElementClick = async (element) => {
		
		if(!listDisabled) {

			setListDisabled(true)
			setLoaderVisible(true)
			const i = element.target.closest('dt').getAttribute('index')
	
			await axiosPrivate.post('/selectsession', { SessionID: list[i].id }).then(({ data }) => {
	
				if(data.Exists) {
					navigate(`/game?sessionid=${list[i].id}&joincode=${data.JoinCode}`, { replace: true })
				} else {
					navigate(`/sessionpreview?sessionid=${list[i].id}`, { replace: false })
				}
	
			}).catch((err) => {
				console.log(err)
				window.alert('Es trat ein unvorhergesehener Fehler auf!')
			})
	
			setLoaderVisible(false)
			setListDisabled(false)

		}

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





	// __________________________________________________Modal-Delete__________________________________________________

	const [ deleteDisabled, setDeleteDisabled ] = useState(false)

	const modalDeleteSubmit = async () => {

		setShow_deleteSession(false)
		setLoaderVisible(true)
		setDeleteDisabled(true)

		for(let i = 0; list_checkbox.length > i; i++) {
			if(list_checkbox[i]) {
				await axiosPrivate.delete('/selectsession',
					{
						headers: { 'Content-Type': 'application/json' },
						withCredentials: true,
						params: { id: list[i].id }
					}
				).catch((err) => {
					console.log(err)
					window.alert('Es trat ein unvorhergesehener Fehler auf!')
				})

			}
		}

		setDeleteDisabled(false)
		setLoaderVisible(false)
		window.location.reload()

	}





	// __________________________________________________Modal-Edit__________________________________________________

	const [ columns, setColumns ] = useState('')
	const [ saveDisabled, setSaveDisabled ] = useState(false)
	const maxColumns = process.env.REACT_APP_MAX_COLUMNS || 10
	const options_columns = Array.from({ length: maxColumns }, (_, index) => index + 1)

	const handle_edit_columnChange = (event) => {

		const intValue = event.target.value
		if (isNaN(parseInt(intValue.substr(intValue.length - 1))) || intValue < 1 || parseInt(intValue) > maxColumns) {return setColumns(intValue.slice(0, -1))}
		setColumns(intValue)

	}

	const edit_show = () => {

		setSuccessfullyUpdatedVisible(false)
		setTmpListPlayers(session?.List_PlayerOrder.map((alias) => getPlayer(alias)))
		setShow_editSession(true)

	}

	const edit_close = () => {
		
		setTmpListPlayers([])
		setColumns('')
		setShow_editSession(false)

	}

	const edit_save = async () => {

		setDialog_loaderVisible(true)
		setSaveDisabled(true)

		await axiosPrivate.post('/updatesession', 
			{ id: session.id, Columns: columns, List_Players: tmpListPlayers },
			{
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		).then(() => {

			setSuccessfullyUpdatedVisible(true)
			edit_close()
			request()

		}).catch((err) => {
			//TODO add some error-handling
			return console.log(err)
		})
		
		setSaveDisabled(false)
		setDialog_loaderVisible(false)

	}





	return (
		<>

			{/* __________________________________________________ Dialogs __________________________________________________ */}

			<OptionsDialog/>





			{/* __________________________________________________ Page __________________________________________________ */}

			<div className='selectsession_trashcan-container'>

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

			</div>



			<div className={`selectsession_successfully-saved ${successfullyUpdatedVisible ? '' : 'notvisible'}`}>
				<p>Erfolgreich gespeichert!</p>
			</div>



			{list.length === 0 ? <>
				
				<h1 className='selectsession_no-game'>Es gibt noch keine Partie!</h1>

			</>:<>
			
				<dl className='selectsession_list'>
					{list.map((s, i) => (
						<dt index={i} key={i}>

							<input 
								className={`button-responsive checkbox-delete ${isMobile ? 'ismobile' : ''}`}
								type='checkbox' 
								onChange={(e) => checkboxClick(i, e.target.checked)} 
							/>

							<div className='names-and-date' onClick={listElementClick}>

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
		


			<CustomLink linkTo='/creategame' text='Erstelle Spiel'/>





			{/* __________________________________________________ Popup Delete __________________________________________________ */}
			
			<Popup
				showPopup={show_deleteSession}
				setShowPopup={setShow_deleteSession}
			>
				<div className='selectsession_popup-delete'>
					<div>

						<h1>Bist du sicher, dass du<br/>diese Session(s) löschen möchtest?</h1>

						<button 
							className='button button-thick' 
							onClick={modalDeleteSubmit}
						>Ja</button>

						<button 
							className='button button-red-reverse' 
							onClick={() => setShow_deleteSession(false)}
							disabled={deleteDisabled}
						>Abbrechen</button>

					</div>
				</div>
			</Popup>





			{/* __________________________________________________ Popup Edit __________________________________________________ */}

			<Popup
				showPopup={show_editSession}
				setShowPopup={setShow_editSession}
			>
				<div className='selectsession_popup-edit'>
					<div>
					
						<h1>Bearbeiten</h1>
						

						{/* ______________________________ChangeColumns______________________________ */}
						
						<div className='change-columns'>

							<label>Spalten</label>
							
							<select
								className='select-input'
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


						{/* ______________________________ChangeNames______________________________ */}
						
						{tmpListPlayers && <DragAndDropNameColorList List_Players={tmpListPlayers} setList_Players={setTmpListPlayers}/>}

						<Loader loaderVisible={dialog_loaderVisible}/>

						<button 
							className='button button-thick' 
							disabled={saveDisabled} 
							onClick={edit_save}
						>Speichern</button>

					</div>
				</div>
			</Popup>

		</>
	)
}
