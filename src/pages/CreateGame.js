


import '../App.css'
import './css/CreateGame.css'

import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { REACT_APP_MAX_PLAYERS, REACT_APP_MAX_COLUMNS, NAME_REGEX, PASSWORD_REGEX } from '../logic/utils-env'

import Loader from '../components/Loader'
import JoinGameInput from '../components/JoinGameInput'
import RegistrationForm from '../components/RegistrationForm'
import ErrorMessage from '../components/ErrorMessage'


function CreateGame() {

	const { setAuth } = useAuth()
	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()

	const [ showJoinGame, setShowJoinGame ] = useState(false)
	const [ loaderVisible, setLoaderVisible ] = useState(false)
	const [ successfullyUpdatedVisible, setSuccessfullyUpdatedVisible ] = useState(false)





	useEffect(() => {

		async function connect() {
			await axiosPrivate.get('/creategame',
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			).catch(() => {
				navigate('/login', { replace: true })
			})
		}

		connect()

	}, [])

	const next = () => {

		if(!players || !columns) return
		navigate(`/enternames?players=${players}&columns=${columns}`, { replace: false })

	}





	// __________________________________________________Players__________________________________________________

	const maxPlayers = REACT_APP_MAX_PLAYERS || 16
	const [ players, setPlayers ] = useState('')
	const options_players = Array.from({ length: maxPlayers }, (_, index) => index + 1)

	const handleInputChange_players = (event) => {
		
		const intValue = event.target.value
		if (isNaN(parseInt(intValue.substr(intValue.length - 1))) || intValue < 1 || parseInt(intValue) > maxPlayers) return setPlayers(intValue.slice(0, -1))
		setPlayers(intValue)
		
	}





	// __________________________________________________Columns__________________________________________________

	const maxColumns = REACT_APP_MAX_COLUMNS || 10
	const [columns, setColumns] = useState('')
	const options_columns = Array.from({ length: maxColumns }, (_, index) => index + 1)

	const handleInputChange_columns = (event) => {
		
		const intValue = event.target.value
		if (isNaN(parseInt(intValue.substr(intValue.length - 1))) || intValue < 1 || parseInt(intValue) > maxColumns) {return setColumns(intValue.slice(0, -1))}
		setColumns(intValue)
		
	}

	const [ logoutDisabled, setLogoutDisalbed ] = useState(false)

	const logout = async () => {

		setLogoutDisalbed(true)

		await axiosPrivate.delete('/logout').then((res) => {
			if(res.status === 204) {
				setAuth({ accessToken: '' })
				navigate('/login', { replace: true })
			}
		})
		
		setLogoutDisalbed(false)

	}




	// __________________________________________________Modal-Settings__________________________________________________

	const [ Name, setName ] = useState('')
	const [ Password, setPassword ] = useState('')
	const [ error, setError ] = useState('')
	const [ settingsDisabled, setSettingsDisabled ] = useState(false)


	const modalSettingsShow = () => {

		setError('')
		setSuccessfullyUpdatedVisible(false)
		document.getElementById('modal-settings').showModal()

	}

	const modalSettingsClose = () => {
		document.getElementById('modal-settings').close()
	}

	const handleSubmit = async (e) => {

		e.preventDefault()
		setLoaderVisible(true)
		setSettingsDisabled(true)

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

		try {

			await axiosPrivate.post('/changecredentials', 
				JSON.stringify(json),
				{
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
			)
            setName('')
            setPassword('')
			setError('')
			setSuccessfullyUpdatedVisible(true)
			modalSettingsClose()

		} catch (err) {
			if (!err?.response) {
				setError('Der Server antwortet nicht!')
			} else if (err.response?.status === 409) {
				setError('Der Benutzername wird bereits benutzt!')
			} else {
				setError('Es trat ein unvorhergesehener Fehler auf!')
			}
		}

		setSettingsDisabled(false)
		setLoaderVisible(false)

	}

	const handleCancel = () => {
		document.getElementById('modal-switchtogame').close()
	}





	return (
		<>

			{/* __________________________________________________Dialogs__________________________________________________ */}

			<dialog id='modal-settings' className='modal'>
				<div 
					style={{
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
						<button
							onClick={() => setShowJoinGame(!showJoinGame)}
							className='button'
							style={{
								color: 'var(--text-color-light)',
								display: 'flex',
								background: 'none', 
								boxShadow: 'none', 
								fontSize: '18px', 
								padding: '3px 0',
								margin: '0', 
							}}
						>
							{showJoinGame ? 'Daten ändern' : 'Spiel beitreten'}
						</button>

						<svg className='button-responsive' onClick={modalSettingsClose} height='28' viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
					</div>


					{showJoinGame && <JoinGameInput marginBottom='20px' marginTop='20px' />}



					{!showJoinGame && <>

						<h1 style={{ fontSize: '50px', fontWeight: 'bold' }}>Einstellungen</h1>
						
						<form onSubmit={handleSubmit}>

							<RegistrationForm Name={Name} setName={setName} Password={Password} setPassword={setPassword} isRequired={false}/>

							<Loader loaderVisible={loaderVisible} marginTop='10px'/>

							<ErrorMessage error={error}/>

							<button 
								className='button' 
								disabled={settingsDisabled}
								style={{ 
									height: '60px', 
									width: '100%', 
								}}
							>Speichern
							</button>
						
						</form>

					</>}

					
					<button 
						className='button' 
						disabled={logoutDisabled}
						style={{ 
							width: '100px', 
							boxShadow: 'none', 
							background: 'none', 
							color: 'rgb(255, 0, 0)', 
							margin: '0', 
							padding: '0', 
						}} 
						onClick={logout}
					>Ausloggen
					</button>

				</div>
			</dialog>

			<dialog id='modal-switchtogame' className='modal'>
				<p style={{ fontSize: '22px', }}>Es wurde ein Spiel gefunden.{<br/>}Soll es geladen werden?</p>
				<div style={{ display: 'flex', justifyContent: 'space-around' }}>
					<button 
						className='button' 
						onClick={() => navigate('/game', { replace: true })}
						style={{
							width: '50%',
						}}
					>Ja</button>
					<button 
						className='button' 
						onClick={handleCancel}
						style={{
							backgroundColor: 'rgb(255, 0, 0)',
							color: 'white',
						}}
					>Abbrechen</button>
				</div>
			</dialog>





			{/* __________________________________________________Page__________________________________________________ */}

			<svg className='button-responsive' style={{ marginBottom: '30px' }} onClick={modalSettingsShow} height="30" viewBox="0 -960 960 960" ><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>

			<div style={{ display: successfullyUpdatedVisible ? 'flex' : 'none', justifyContent: 'center', marginBottom: '25px' }}>
				<svg height='25' viewBox='0 -960 960 960' style={{ fill: 'rgb(0, 255, 0)' }}><path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/></svg>
				<p style={{ width: 'max-content', height: '100%', fontSize: '23px', margin: '0', marginLeft: '5px', color: 'rgb(0, 255, 0)' }}>Erfolgreich gespeichert!</p>
			</div>

			<div className='select-container'>
				<label>Spieler</label>
				<select
					className='select-input'
					value={players}
					onChange={handleInputChange_players}
				>
					<option value='' disabled>
						Spieleranzahl
					</option>
					{options_players.map((p) => (
						<option key={p} value={p}>{p}</option>
					))}
				</select>
			</div>

			<div className='select-container'>
				<label>Spalten</label>
				<select
					className='select-input'
					value={columns}
					onChange={handleInputChange_columns}
					>
					<option value='' disabled>
						Spaltenanzahl
					</option>
					{options_columns.map((c) => (
						<option key={c} value={c}>{c}</option>
					))}
				</select>
			</div>

			<button className='button' style={{ width: '100%', height: '50px', marginBottom: '0px' }} onClick={next}>Weiter</button>

			<div style={{ display: 'flex', marginTop: '10px' }}>
				<p className='link-switch'>
					<Link to='/selectsession'>Lade Spiel</Link>
				</p>
			</div>

		</>
	)
}

export default CreateGame
