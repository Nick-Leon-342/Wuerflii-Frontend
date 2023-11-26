

import '../App.css'
import './css/SelectSession.css'

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate } from '../logic/utils'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { isMobile } from 'react-device-detect'
import Loader from '../components/Loader'
import DragAndDropNameColorList from '../components/DragAndDropNameColorList'
import JoinGameInput from '../components/JoinGameInput'


function SelectSession() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const [list, setList] = useState([])
	const [list_checkbox] = useState([])
	const [trashcanDisabled, setTrashcanDisabled] = useState(true)
	const [settingsDisabled, setSettingsDisabled] = useState(true)
	const [session, setSession] = useState('')
	const [tmpListPlayers, setTmpListPlayers] = useState([])
	const [loaderVisible, setLoaderVisible] = useState(false)
	const [dialog_loaderVisible, setDialog_loaderVisible] = useState(false)
	const [successfullyUpdatedVisible, setSuccessfullyUpdatedVisible] = useState(false)
	
	const message = 'Es gibt noch keine Partie!'





	useEffect(() => {request()}, [])

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

	const listElementClick = (element) => {
		
		const i = element.target.closest('dt').getAttribute('index')
		navigate(`/sessionpreview?sessionid=${list[i].id}`, { replace: false })

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

	const modalDeleteShow = async () => {

		if(trashcanDisabled) return
		document.getElementById('modal-delete').showModal()
		
	}

	const modalDeleteSubmit = async () => {

		modalDeleteClose()
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

	const modalDeleteClose = () => {
		document.getElementById('modal-delete').close()
	}





	// __________________________________________________Modal-Edit__________________________________________________

	const [ columns, setColumns ] = useState('')
	const [ saveDisabled, setSaveDisabled ] = useState(false)
	const maxColumns = process.env.REACT_APP_MAX_COLUMNS || 10
	const options_columns = Array.from({ length: maxColumns }, (_, index) => index + 1)

	const modalEditHandleColumnChange = (event) => {

		const intValue = event.target.value
		if (isNaN(parseInt(intValue.substr(intValue.length - 1))) || intValue < 1 || parseInt(intValue) > maxColumns) {return setColumns(intValue.slice(0, -1))}
		setColumns(intValue)

	}

	const modalEditShow = () => {

		setSuccessfullyUpdatedVisible(false)
		setTmpListPlayers(session?.List_PlayerOrder.map((alias) => getPlayer(alias)))
		document.getElementById('modal-edit').showModal()

	}

	const modalEditClose = () => {
		
		setTmpListPlayers([])
		setColumns('')
		document.getElementById('modal-edit').close()

	}

	const modalEditSave = async () => {

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
			modalEditClose()
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

			{/* __________________________________________________Dialogs__________________________________________________ */}

			<dialog id='modal-edit' className='modal'>
				<div 
					style={{
						display: 'flex',
						flexDirection: 'column',
						width: '',
					}}
				>
					<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<svg className='button-responsive' onClick={modalEditClose} height='28' viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
					</div>
					
					<h1 style={{ fontSize: '50px', fontWeight: 'bold' }}>Bearbeiten</h1>
					

					{/* ______________________________ChangeColumns______________________________ */}
					
					<div className='select-container' style={{ width: '100%' }}>
						<label>Spalten</label>
						<select
							className='select-input'
							value={columns}
							onChange={modalEditHandleColumnChange}
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

					
					<div className={`loader ${dialog_loaderVisible ? '' : 'notVisible'}`}>
						<span/>
						<span/>
						<span/>
					</div>

					<button 
						className='button' 
						disabled={saveDisabled} 
						onClick={modalEditSave} 
						style={{ 
							width: '100%', 
							height: '60px', 
							marginBottom: '30px' 
						}}
					>Speichern
					</button>

				</div>
			</dialog>

			<dialog id='modal-delete' className='modal'>

				<p style={{ fontSize: '22px', marginTop: '20px' }}>
					Bist du sicher, dass du<br/>diese Session(s) löschen möchtest?
				</p>

				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<button 
						className='button' 
						onClick={modalDeleteSubmit}
						style={{
							width: '60%',
							height: '40px', 
						}}
					>Ja</button>

					<button 
						className='button' 
						onClick={modalDeleteClose}
						disabled={deleteDisabled}
						style={{
							backgroundColor: 'rgb(255, 0, 0)',
							color: 'white',
						}}
					>Abbrechen</button>
				</div>

			</dialog>





			{/* __________________________________________________Page__________________________________________________ */}

			<div className={`trashcan-container`}>
				<svg style={{ marginLeft: '12px', marginRight: '3px' }} className={`${list.length === 0 ? 'notVisible' : (trashcanDisabled ? 'disabled' : 'button-responsive')}`} onClick={modalDeleteShow} width='30' viewBox="-0.5 -0.5 458 510"><g><rect x="58" y="55" width="340" height="440" rx="51" ry="51" fill="none" strokeWidth="30" pointerEvents="all"/><rect x="15" y="55" width="427" height="30" rx="4.5" ry="4.5" fill="none" strokeWidth="30" pointerEvents="all"/><rect x="125" y="145" width="50" height="280" rx="9" ry="9" fill="none" strokeWidth="50" pointerEvents="all"/><rect x="275" y="145" width="50" height="280" rx="9" ry="9" fill="none" strokeWidth="50" pointerEvents="all"/><rect x="158" y="15" width="142" height="30" rx="4.5" ry="4.5" fill="none" strokeWidth="30" pointerEvents="all"/></g></svg>
				<Loader loaderVisible={loaderVisible}/>
				<svg style={{ marginRight: '15px' }} className={`${list.length === 0 ? 'notVisible' : (settingsDisabled ? 'disabled' : 'button-responsive')}`} onClick={modalEditShow} width='30' viewBox="0 -960 960 960" ><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
			</div>

			<div style={{ display: successfullyUpdatedVisible ? 'flex' : 'none', justifyContent: 'center', marginTop: '10px' }}>
				<svg 
					height='25' 
					viewBox='0 -960 960 960'
					style={{
						fill: 'rgb(0, 255, 0)',
					}}
				><path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/></svg>
				<p style={{ width: 'max-content', height: '100%', fontSize: '23px', margin: '0', marginLeft: '5px', color: 'rgb(0, 255, 0)' }}>Erfolgreich gespeichert!</p>
			</div>

			<dl className='sessionList'>
				{list.length === 0 ? (
					<dt style={{ width: '100%', fontSize: '33px', textAlign: 'center' }}>
						{message}
					</dt>
				) : (
					list.map((s, i) => (
						<dt className='listElement' index={i} key={i}>
							<input className='checkbox-delete button-responsive' style={isMobile ? { marginTop: '10px', width: '27px', height: '27px' } : {}} type='checkbox' onChange={(e) => checkboxClick(i, e.target.checked)} />

							<div className='container' onClick={listElementClick}>
								<label className='label'>
									{s.List_PlayerOrder.map((alias) => {
										
										for(const p of s.List_Players) {
											if(alias === p.Alias) {
												return p.Name
											}
										}
										return ''
									}).join(' vs ')}
								</label>
								<label className='label date'>{formatDate(s.LastPlayed)}</label>
							</div>
						</dt>
					))
				)}
			</dl>
			
			<div style={{ display: 'flex'}}>
				<p className='link-switch'>
					<Link to='/creategame'>Erstelle Spiel</Link>
				</p>
			</div>

		</>
	)
}

export default SelectSession
