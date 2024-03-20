

import ToggleSlider from '../ToggleSlider'
import JoinGameInput from '../JoinGameInput'

import { useEffect, useState } from 'react'
import './css/OptionsDialog.css'
import Close from '../NavigationElements/Close'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import RegistrationForm from '../RegistrationForm'
import Loader from '../Loader'
import ErrorMessage from '../ErrorMessage'





export default function OptionsDialog() {

    const { setAuth } = useAuth()

	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()

	const showOptions = () => {	document.getElementById('modal-options').showModal()}
	
	const [ darkModeToggled, setDarkModeToggled ] = useState(localStorage.getItem('darkMode') === 'true' || false)
	const closeOptions = () => {document.getElementById('modal-options').close()}

	const [ loaderVisible, setLoaderVisible ] = useState(false)
	const [ successfullyUpdatedVisible, setSuccessfullyUpdatedVisible ] = useState(false)

	const [ Name, setName ] = useState('')
	const [ Password, setPassword ] = useState('')
	const [ error, setError ] = useState('')
	const [ settingsDisabled, setSettingsDisabled ] = useState(false)

	const [ NAME_REGEX, setNAME_REGEX ] = useState('')
	const [ PASSWORD_REGEX, setPASSWORD_REGEX ] = useState('')





	useEffect(() => {

		localStorage.setItem('darkMode', darkModeToggled)
		if(darkModeToggled) {document.body.classList.add('dark')
		} else {document.body.classList.remove('dark')}

	}, [darkModeToggled])

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

			await axiosPrivate.patch('/auth/login', json)
            setName('')
            setPassword('')
			setError('')
			setSuccessfullyUpdatedVisible(true)

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





	return (<>
		<svg 
			className='button-responsive optionsdialog_icon' 
			onClick={showOptions} 
			viewBox='0 -960 960 960' 
		>
			<path d='m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z'/>
		</svg>
	
		<dialog id='modal-options' className='modal'>

			<div className='optionsdialog_container'>

				<Close onClick={closeOptions}/>
				


				<h1>Einstellungen</h1>



				<div className='optionsdialog_joincode'>
					
					<label>Dark mode</label>
					<ToggleSlider 
						toggled={darkModeToggled} 
						setToggled={setDarkModeToggled} 
						scale='.7'
					/>
					
				</div>

				<JoinGameInput/>

				<form onSubmit={handleSubmit}>

						<RegistrationForm Name={Name} setName={setName} Password={Password} setPassword={setPassword} isRequired={false}/>

						<Loader loaderVisible={loaderVisible} marginTop='10px'/>

						<ErrorMessage error={error}/>

						<button 
							className='button button-thick' 
							disabled={settingsDisabled}
						>Speichern</button>
					
					</form>
					


					<button 
						className='button logout' 
						disabled={logoutDisabled}
						onClick={logout}
					>Ausloggen</button>

			</div>
			
		</dialog>
	</>)

}
