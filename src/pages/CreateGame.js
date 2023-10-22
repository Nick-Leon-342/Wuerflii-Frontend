


import '../App.css'
import './css/CreateGame.css'

import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { resizeEvent, sessionStorage_attributes, sessionStorage_players, NAME_REGEX, PASSWORD_REGEX } from './utils'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'

import DialogName from '../dialog/DialogName'
import DialogPassword from '../dialog/DialogPassword'


function CreateGame() {
	
	const { setAuth } = useAuth()
	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()


	const showModal = () => {document.getElementById('modal').showModal()}
	const closeModal = () => {document.getElementById('modal').close()}


	useEffect(() => {
		resizeEvent()
	}, [])

	

	//____________________Next____________________

	const next = () => {

		if(!players || !columns) return

		sessionStorage.setItem(sessionStorage_players, players)
		sessionStorage.setItem(sessionStorage_attributes, columns)

		navigate('/enternames', { replace: false })

	}


	//____________________Players____________________

	const maxPlayers = process.env.MAX_PLAYERS || 16
	const [players, setPlayers] = useState('')
	const options_players = Array.from({ length: maxPlayers }, (_, index) => index + 1)

	const handleInputChange_players = (event) => {
		
		const intValue = event.target.value
		if (isNaN(parseFloat(intValue)) || intValue < 1 || intValue > maxPlayers) {return setPlayers(intValue.slice(0, -1))}
		setPlayers(intValue)
		
	}


	//____________________Columns____________________

	const maxColumns = process.env.MAX_COLUMNS || 10
	const [columns, setColumns] = useState('')
	const options_columns = Array.from({ length: maxColumns }, (_, index) => index + 1)

	const handleInputChange_columns = (event) => {
		
		const intValue = event.target.value
		if (isNaN(parseFloat(intValue)) || intValue < 1 || intValue > maxColumns) {return setColumns(intValue.slice(0, -1))}
		setColumns(intValue)
		
	}

	const logout = () => {

		axiosPrivate.delete('/logout').then((res) => {
			if(res.status === 204) {
				setAuth({ accessToken: '' })
				navigate('/login', { replace: true })
			}
		})

	}


	const [ infoName, setInfoName ] = useState(false)
	const [ Name, setName ] = useState('')

	const [ Password, setPassword ] = useState('')
	const [ infoPassword, setInfoPassword ] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()

		if ((Name && !NAME_REGEX.test(Name)) || (Password && !PASSWORD_REGEX.test(Password)) || (!Name && !Password)) {
			return
		}

		let json = {}
		if(NAME_REGEX.test(Name) && PASSWORD_REGEX.test(Password)) {
			//Name and Password are valid

			json.Name = Name
			json.Password = Password

		} else if(NAME_REGEX.test(Name)) {
			//Name is valid, password not entered

			json.Name = Name

		} else {
			//Password is valid, name not entered

			json.Password = Password

		}

		console.log(json)

		try {

			// await axiosPrivate.post('/auth/changecredentials', 
			// 	JSON.stringify({ Name, Password }),
			// 	{
            //         headers: { 'Content-Type': 'application/json' },
            //         withCredentials: true
            //     }
			// )
            setName('')
            setPassword('')

		} catch (err) {
			console.log(err)
			// if (!err?.response) {
			// 	setErrMsg('No Server Response')
			// } else if (err.response?.status === 409) {
			// 	setErrMsg('Username Taken')
			// } else {
			// 	setErrMsg('Registration Failed')
			// }
		}
	}


	return (
		<>
			<dialog id='modal' className='modal'>
				<div 
					style={{
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<svg onClick={closeModal} height='24' viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
					</div>
					<h1>Einstellungen</h1>
					
					<form onSubmit={handleSubmit}>
					
						<p htmlFor='Username' className='input-header' style={{ color: 'black' }}>
							Benutzernamen ändern
							<svg 
								height='24' 
								viewBox='0 -960 960 960'
								style={{
									fill: 'rgb(0, 255, 0',
									display: Name && NAME_REGEX.test(Name) ? '' : 'none',
								}}
							><path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/></svg>
							<svg 
								height='24' 
								viewBox='0 -960 960 960'
								style={{
									fill: 'rgb(255, 0, 0)',
									display: Name && !NAME_REGEX.test(Name) ? '' : 'none',
								}}
							><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
						</p>
						<input
							className='input'
							value={Name}
							onChange={(e) => setName(e.target.value)}
							autoComplete='off'
							id='Username'
							autoFocus={true}
							placeholder='Benutzername'
							onFocus={() => setInfoName(true)}
							onBlur={() => setInfoName(false)}
						/>
						{infoName && !NAME_REGEX.test(Name) && <DialogName/>}
						


						<p htmlFor='Password' className='input-header' style={{ color: 'black' }}>
							Passwort ändern
							<svg 
								height='24' 
								viewBox='0 -960 960 960'
								style={{
									fill: 'rgb(0, 255, 0',
									display: Password && PASSWORD_REGEX.test(Password) ? '' : 'none',
								}}
							><path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/></svg>
							<svg 
								height='24' 
								viewBox='0 -960 960 960'
								style={{
									fill: 'rgb(255, 0, 0)',
									display: Password && !PASSWORD_REGEX.test(Password) ? '' : 'none',
								}}
							><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
						</p>
						<input
							type='password'
							className='input'
							value={Password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete='off'
							id='Password'
							placeholder='Passwort'
							onFocus={() => setInfoPassword(true)}
							onBlur={() => setInfoPassword(false)}
						/>
						{infoPassword && !PASSWORD_REGEX.test(Password) && <DialogPassword/>}

						<br/>
						<br/>
						<br/>
						<br/>
						<br/>
						<br/>
						<button className='button' style={{ width: '100%'}}>Speichern</button>
					
					</form>
					
					<div className='logout'><button className='logout-button' onClick={logout}>Ausloggen</button></div>

				</div>
			</dialog>

			<svg onClick={showModal} height="24" viewBox="0 -960 960 960" ><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
			<br/>
			<br/>
			<div className='input-container'>
				<label className='input-header' style={{ color: 'black' }}>Spieler</label>
				{isMobile ? (
					<select
						className='input input-mobile'
						value={players}
						onChange={handleInputChange_players}
						>
						<option value="" disabled>
							Spieleranzahl
						</option>
						{options_players.map((p) => (
							<option key={p} value={p}>{p}</option>
						))}
					</select>
				) : (
					<>
						<input 
							className='input input-computer' 
							list='players'
							value={players}
							onChange={handleInputChange_players}
						/>
						<datalist id='players'>
							{options_players.map((p) => {
								return <option key={p} value={p}/>
							})}
						</datalist>
					</>
				)}
			</div>
			<br/>
			<div className='input-container'>
				<label className='input-header' style={{ color: 'black' }}>Spalten</label>
				{isMobile ? (
					<select
						className='input input-mobile'
						value={columns}
						onChange={handleInputChange_columns}
						>
						<option value="" disabled>
							Spaltenanzahl
						</option>
						{options_columns.map((c) => (
							<option key={c} value={c}>{c}</option>
						))}
					</select>
				) : (
					<>
						<input 
							className='input input-computer' 
							list='columns'
							value={columns}
							onChange={handleInputChange_columns}
						/>
						<datalist id='columns'>
							{options_columns.map((c) => {
								return <option key={c} value={c} />
							})}
						</datalist>
					</>
				)}
			</div>
			<br/>
			<button className='button' style={{ width: '100%', marginBottom: '0px' }} onClick={next}>Weiter</button>

			<div style={{ display: 'flex' }}>
				<p className='link-switch'>
					<Link to='/selectsession'>Lade Spiel</Link>
				</p>
			</div>
		</>
	)
}

export default CreateGame
