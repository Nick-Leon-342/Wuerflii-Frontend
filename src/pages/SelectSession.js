

import '../App.css'
import './css/SelectSession.css'

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate, sessionStorage_session } from './utils'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { isMobile } from 'react-device-detect'


function SelectSession() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const [list, setList] = useState([])
	const [list_checkbox] = useState([])
	const [trashcanDisabled, setTrashcanDisabled] = useState(true)
	const [settingsDisabled, setSettingsDisabled] = useState(true)
	const [session, setSession] = useState('')
	const [list_session, setList_Session] = useState([])
	const [loaderVisible, setLoaderVisible] = useState(false)
	const [dialog_loaderVisible, setDialog_loaderVisible] = useState(false)
	const [successfullyUpdatedVisible, setSuccessfullyUpdatedVisible] = useState(false)
	
	const message = 'Es gibt noch keine Partie!'





	useEffect(() => {request()}, [])

	async function request() {

		setLoaderVisible(true)

		await axiosPrivate.get('/selectsession').then((res) => {
			const l = res.data
			const tmp = []

			for(const e of l) {
				tmp.push({ 
					id: e.id,
					Attributes: JSON.parse(e.Attributes), 
					List_Players: JSON.parse(e.List_Players) 
				})
			}
			
			tmp.sort(sortByTimestampDesc)
			setList(tmp)

		}).catch((err) => {
			console.log(err)
		})

		setLoaderVisible(false)

	}

	const sortByTimestampDesc = (a, b) => {
		return new Date(b.Attributes.LastPlayed) - new Date(a.Attributes.LastPlayed)
	}
	




	// __________________________________________________ListElement__________________________________________________

	const listElementClick = (element) => {
		
		const i = element.target.closest('dt').getAttribute('index')
		sessionStorage.setItem(sessionStorage_session, JSON.stringify(list[i]))
		navigate('/sessionpreview', { replace: false })

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

	const modalDeleteShow = async () => {

		if(trashcanDisabled) return
		document.getElementById('modal-delete').showModal()
		
	}

	const modalDeleteSubmit = async () => {

		modalDeleteClose()
		setLoaderVisible(true)

		for(let i = 0; list_checkbox.length > i; i++) {
			if(list_checkbox[i]) {
				console.log(list[i])
				await axiosPrivate.delete('/selectsession',
					{
						headers: { 'Content-Type': 'application/json' },
						withCredentials: true,
						params: { id: list[i].id }
					}
				).catch((err) => {
					console.log(err)
				})


			}
		}

		setLoaderVisible(false)
		window.location.reload()

	}

	const modalDeleteClose = () => {
		document.getElementById('modal-delete').close()
	}





	// __________________________________________________Modal-Edit__________________________________________________

	const [columns, setColumns] = useState('')
	const maxColumns = process.env.REACT_APP_MAX_COLUMNS || 10
	const options_columns = Array.from({ length: maxColumns }, (_, index) => index + 1)

	const modalEditHandleColumnChange = (event) => {

		const intValue = event.target.value
		if (isNaN(parseInt(intValue.substr(intValue.length - 1))) || intValue < 1 || parseInt(intValue) > maxColumns) {return setColumns(intValue.slice(0, -1))}
		setColumns(intValue)

	}

	const modalEditShow = () => {

		const tmp = []

		for(let i = 0; session.List_Players.length > i; i++) {
			tmp.push({ Name: session.List_Players[i].Name, Color: session.List_Players[i].Color })
		}

		setSuccessfullyUpdatedVisible(false)
		setList_Session(tmp)
		document.getElementById('modal').showModal()

	}

	const modalEditClose = () => {
		
		setList_Session([])
		setColumns('')
		document.getElementById('modal').close()
	}

	const modalEditSave = async () => {

		setDialog_loaderVisible(true)

		if(columns !== '') session.Attributes.Columns = columns
		for(let i = 0; session.List_Players.length > i; i++) {
			session.List_Players[i].Name = list_session[i].Name
			session.List_Players[i].Color = list_session[i].Color
		}

		await axiosPrivate.post('/selectsession', 
			JSON.stringify(session),
			{
                   headers: { 'Content-Type': 'application/json' },
                   withCredentials: true
               }
		).then((res) => {
			if(res.status === 204) {
				setSuccessfullyUpdatedVisible(true)
				modalEditClose()
				request()
			}
		}).catch((err) => {
			return console.log(err)
		})
		
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
						<svg onClick={modalEditClose} height='24' viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
					</div>
					
					<h1>Bearbeiten</h1>
					

					{/* ______________________________ChangeColumns______________________________ */}
					<div className='input-container' style={{ marginBottom: '20px' }}>
						<label className='input-header'>Spalten</label>
						{isMobile ? (
							<select
								className='input-mobile'
								onChange={modalEditHandleColumnChange}
								value={columns}
								>
								<option value='' disabled>
									Spaltenanzahl
								</option>
								{options_columns.map((c) => (
									<option key={c} value={c}>{c}</option>
								))}
							</select>
						) : (
							<>
								<input 
									className='input-computer' 
									list='columns'
									placeholder={session?.Attributes?.Columns}
									onChange={modalEditHandleColumnChange}
									value={columns}
								/>
								<datalist id='columns'>
									{options_columns.map((c) => {
										return <option key={c} value={c} />
									})}
								</datalist>
							</>
						)}
					</div>


					{/* ______________________________ChangeNames______________________________ */}
					<dl id='enterNamesList'>
						{list_session.map((p, index) => (
							<dt className='enterNamesElement' key={index}>
								<input
									defaultValue={p.Name}
									onChange={(e) => p.Name = e.target.value}
								/>
								<input
									className={isMobile ? 'colorbox-mobile' : 'colorbox-computer'}
									type='color'
									defaultValue={p.Color}
									onChange={(e) => p.Color = e.target.value}
								/>
							</dt>
						))}
					</dl>

					
					<div className={`loader ${dialog_loaderVisible ? '' : 'notVisible'}`}>
						<span/>
						<span/>
						<span/>
					</div>

					<button className='button' onClick={modalEditSave} style={{ width: '100%' }}>Speichern</button>

				</div>
			</dialog>

			<dialog id='modal-delete' className='modal'>
				<label>Bist du sicher, dass du diese Session(s) löschen möchtest?</label>
				<div style={{ display: 'flex', justifyContent: 'space-around' }}>
					<button 
						className='button' 
						onClick={modalDeleteSubmit}
						style={{
							width: '50%',
						}}
					>Ja</button>
					<button 
						className='button' 
						onClick={modalDeleteClose}
						style={{
							backgroundColor: 'rgb(255, 0, 0)',
							color: 'white',
						}}
					>Abbrechen</button>
				</div>
			</dialog>





			{/* __________________________________________________Page__________________________________________________ */}

			<div className={`trashcan-container`}>
				<svg style={{ marginLeft: '12px', marginRight: '3px' }} className={`${list.length === 0 ? 'notVisible' : (trashcanDisabled ? 'disabled' : '')}`} onClick={modalDeleteShow} width='25' viewBox="-0.5 -0.5 458 510"><g><rect x="58" y="55" width="340" height="440" rx="51" ry="51" fill="none" strokeWidth="30" pointerEvents="all"/><rect x="15" y="55" width="427" height="30" rx="4.5" ry="4.5" fill="none" strokeWidth="30" pointerEvents="all"/><rect x="125" y="145" width="50" height="280" rx="9" ry="9" fill="none" strokeWidth="50" pointerEvents="all"/><rect x="275" y="145" width="50" height="280" rx="9" ry="9" fill="none" strokeWidth="50" pointerEvents="all"/><rect x="158" y="15" width="142" height="30" rx="4.5" ry="4.5" fill="none" strokeWidth="30" pointerEvents="all"/></g></svg>
				<div className={`loader ${loaderVisible ? '' : 'notVisible'}`}>
					<span/>
					<span/>
					<span/>
				</div>
				<svg style={{ marginRight: '15px' }} className={`${list.length === 0 ? 'notVisible' : (settingsDisabled ? 'disabled' : '')}`} onClick={modalEditShow} width='25' viewBox="0 -960 960 960" ><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
			</div>

			<div style={{ display: successfullyUpdatedVisible ? 'flex' : 'none', justifyContent: 'center', marginTop: '10px' }}>
				<svg 
					height='20' 
					viewBox='0 -960 960 960'
					style={{
						fill: 'rgb(0, 255, 0)',
					}}
				><path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/></svg>
				<p style={{ width: 'max-content', height: '100%', fontSize: '19px', margin: '0', marginLeft: '5px', color: 'rgb(0, 255, 0)' }}>Erfolgreich gespeichert!</p>
			</div>

			<dl className='sessionList'>
				{list.length === 0 ? (
					<dt style={{ fontSize: '25px', width: 'max-content' }}>{message}</dt>
				) : (
					list.map((s, i) => (
						<dt className='listElement' index={i} key={i}>
							<input className='checkbox-delete' style={isMobile ? { marginTop: '7px' } : {}} type='checkbox' onChange={(e) => checkboxClick(i, e.target.checked)} />

							<div className='container' onClick={listElementClick}>
								<label className='label'>
									{s.List_Players.map((p) => p.Name).join(' vs ')}
								</label>
								<label className='label date'>{formatDate(s.Attributes.LastPlayed)}</label>
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
