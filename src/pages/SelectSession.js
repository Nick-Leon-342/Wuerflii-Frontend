

import '../App.css'
import './css/SelectSession.css'

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate, resizeEvent, sessionStorage_attributes, sessionStorage_players } from './utils'
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
	const [loaderVisible, setLoaderVisible] = useState(false)
	
	const message = 'Es gibt noch keine Partie!'





	useEffect(() => {

		async function request() {

			setLoaderVisible(true)

			await axiosPrivate.get('/selectsession').then((res) => {
				const l = res.data
				const tmp = []

				for(const e of l) {
					tmp.push({ 
						Attributes: JSON.parse(e.Attributes), 
						List_Players: JSON.parse(e.List_Players) 
					})
				}
				
				tmp.sort(sortByTimestampDesc)
				setList(tmp)
			})

			setLoaderVisible(false)

		}

		request()
		resizeEvent()

	}, [])

	const sortByTimestampDesc = (a, b) => {
		return new Date(b.Attributes.LastPlayed) - new Date(a.Attributes.LastPlayed)
	}





	const handleDelete = async () => {

		if(trashcanDisabled) return
		setLoaderVisible(true)

		if((window.confirm('Bist du sicher, dass du diese Session(s) löschen möchtest?'))) {
			for(let i = 0; list_checkbox.length > i; i++) {
				if(list_checkbox[i]) {
					await axiosPrivate.delete('/selectsession',
						{
							headers: { 'Content-Type': 'application/json' },
							withCredentials: true,
							params: list[i].Attributes
						}
					).catch((e) => {
						console.log(e)
					})


				}
			}
		}

		setLoaderVisible(false)
		window.location.reload()
		
	}





	const handleClick = (element) => {
		
		const i = element.target.closest('dt').getAttribute('index')
		
		sessionStorage.setItem(sessionStorage_attributes, JSON.stringify(list[i].Attributes))
		sessionStorage.setItem(sessionStorage_players, JSON.stringify(list[i].List_Players))

		navigate('/sessionpreview', { replace: false })

	}





	const handleCheckbox = (index, checked) => {

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

	const showSettings = () => {

		setColumns(session?.Attributes?.Columns)
		document.getElementById('modal').showModal()

	}

	const handleSave = () => {

		console.log(columns)
		return 

	}


	const [columns, setColumns] = useState('')
	const maxColumns = process.env.REACT_APP_MAX_COLUMNS || 10
	const options_columns = Array.from({ length: maxColumns }, (_, index) => index + 1)

	const handleColumnChange = (event) => {

		const intValue = event.target.value
		if (isNaN(parseInt(intValue.substr(intValue.length - 1))) || intValue < 1 || parseInt(intValue) > maxColumns) {return setColumns(intValue.slice(0, -1))}
		setColumns(intValue)

	}

	const handleNameChange = (p, n) => {

	}

	const handleColorChange = (p, c) => {

	}





	return (
		<>
			<dialog id='modal' className='modal'>
				<div 
					style={{
						display: 'flex',
						flexDirection: 'column',
						width: '',
					}}
				>
					<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<svg onClick={() => document.getElementById('modal').close()} height='24' viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
					</div>
					
					<h1>Einstellungen</h1>
					

					{/* ______________________________ChangeColumns______________________________ */}
					<div className='input-container' style={{ marginBottom: '20px' }}>
						<label className='input-header'>Spalten</label>
						{isMobile ? (
							<select
								className='input-mobile'
								placeholder={session?.Attributes?.Columns}
								onChange={handleColumnChange}
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
									onChange={handleColumnChange}
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
						{session?.List_Players?.map((p, index) => (
							<dt className='enterNamesElement' key={index}>
								<input
									defaultValue={p.Name}
									onChange={(e) => handleNameChange(p, e.target.value)}
								/>
								<input
									className={isMobile ? 'colorbox-mobile' : 'colorbox-computer'}
									type='color'
									value={p.Color}
									onChange={(e) => handleColorChange(p, e.target.value)}
								/>
							</dt>
						))}
					</dl>

					<button className='button' onClick={handleSave} style={{ width: '100%' }}>Speichern</button>

				</div>
			</dialog>

			<div className={`trashcan-container`}>
				<svg style={{ marginLeft: '12px', marginRight: '3px' }} className={`${list.length === 0 ? 'notVisible' : (trashcanDisabled ? 'disabled' : '')}`} onClick={handleDelete} width='25' viewBox="-0.5 -0.5 458 510"><g><rect x="58" y="55" width="340" height="440" rx="51" ry="51" fill="none" strokeWidth="30" pointerEvents="all"/><rect x="15" y="55" width="427" height="30" rx="4.5" ry="4.5" fill="none" strokeWidth="30" pointerEvents="all"/><rect x="125" y="145" width="50" height="280" rx="9" ry="9" fill="none" strokeWidth="50" pointerEvents="all"/><rect x="275" y="145" width="50" height="280" rx="9" ry="9" fill="none" strokeWidth="50" pointerEvents="all"/><rect x="158" y="15" width="142" height="30" rx="4.5" ry="4.5" fill="none" strokeWidth="30" pointerEvents="all"/></g></svg>
				<div className={`loader ${loaderVisible ? '' : 'notVisible'}`}>
					<span/>
					<span/>
					<span/>
				</div>
				<svg style={{ marginRight: '15px' }} className={`${list.length === 0 ? 'notVisible' : (settingsDisabled ? 'disabled' : '')}`} onClick={showSettings} width='25' viewBox="0 -960 960 960" ><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
			</div>
			<dl className='sessionList'>
				{list.length === 0 ? (
					<dt className='message'>{message}</dt>
				) : (
					list.map((s, i) => (
						<dt className='listElement' index={i} key={i}>
							<input className='checkbox-delete' type='checkbox' onChange={(e) => handleCheckbox(i, e.target.checked)} />

							<div className='container' onClick={handleClick}>
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
