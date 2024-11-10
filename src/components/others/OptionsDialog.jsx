

import './scss/OptionsDialog.scss'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from './Popup'
import ErrorMessage from './ErrorMessage'
import CustomButton from './Custom_Button'
import LoaderBox from '../Loader/Loader_Box'
import RegistrationForm from './RegistrationForm'
import Previous from '../NavigationElements/Previous'





export default function OptionsDialog({
	setUser, 
	user, 
}) {

    const { setAuth } = useAuth()

	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()
	const handle_error = useErrorHandling()

	const [ show_options, setShow_options ] = useState(false)
	
	const [ loading_darkMode, setLoading_darkMode ] = useState(false)

	const [ Name, setName ] = useState('')
	const [ Password, setPassword ] = useState('')
	const [ error, setError ] = useState('')
	const [ loading_credentials, setLoading_credentials ] = useState(false)
	const [ successfullyUpdated, setSuccessfullyUpdated ] = useState(false)

	const [ NAME_REGEX, setNAME_REGEX ] = useState('')
	const [ PASSWORD_REGEX, setPASSWORD_REGEX ] = useState('')

	const [ show_editCredentials, setShow_editCredentials ] = useState(false)





	useEffect(() => {
		
		if(!user) return
		
		if(user.DarkMode) {
			document.body.classList.add('dark')
		} else {
			document.body.classList.remove('dark')
		}

	}, [ user ])

	const change_dark_mode = async () => {

		setLoading_darkMode(true)

		axiosPrivate.patch('/user', { DarkMode: !user.DarkMode }).then(() => {

			setUser(prev => {
				const tmp = { ...prev }
				tmp.DarkMode = !tmp.DarkMode
				return tmp
			})

		}).catch(err => {

			handle_error({
				err
			})

		}).finally(() => setLoading_darkMode(false))

	}

	const handleSubmit = async (e) => {

		e.preventDefault()
		setError('')

		if ((Name && !NAME_REGEX.test(Name)) || (Password && !PASSWORD_REGEX.test(Password)) || (!Name && !Password)) return


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

		setLoading_credentials(true)

		axiosPrivate.patch('/auth/login', json).then(() => {

			setSuccessfullyUpdated(true)
			setName('')
			setPassword('')

		}).catch((err) => {

			handle_error({
				err,
				handle_409: () => {
					setError('Name bereits vergeben!')
				}
			})

		}).finally(() => { setLoading_credentials(false) })

	}





	// __________________________________________________ Logout __________________________________________________

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

		<button
			onClick={() => setShow_options(true)} 
			className='button button-reverse button-responsive optionsdialog_icon'
		><svg viewBox='0 -960 960 960'><path d='m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z'/></svg></button>
	




		<Popup
			showPopup={show_options}
			setShowPopup={setShow_options}
			title='Einstellungen'
		>
			<div className='optionsdialog'>

				{show_editCredentials ? <>

					<Previous
						onClick={() => setShow_editCredentials(false)}
					/>

					<form onSubmit={handleSubmit}>

						<h2 className={`${successfullyUpdated ? 'visible': ''}`}>Erfolgreich gespeichert!</h2>

						<RegistrationForm 
							Name={Name} 
							setName={setName} 
							Password={Password} 
							setPassword={setPassword} 
							isRequired={false}
							NAME_REGEX={NAME_REGEX}
							setNAME_REGEX={setNAME_REGEX}
							PASSWORD_REGEX={PASSWORD_REGEX}
							setPASSWORD_REGEX={setPASSWORD_REGEX}
						/>

						<ErrorMessage error={error}/>

						<CustomButton
							loading={loading_credentials}
							text='Speichern'
						/>

					</form>
				
				</>:<>

					<div className='container'>

						<section className='joincode'>
							
							{loading_darkMode && <>
								<div className='optionsdialog_loading_darkmode-container'>
									<LoaderBox className='optionsdialog_loading_darkmode' dark={true}/>
								</div>
							</>}
							
							{!loading_darkMode &&
								<input
									type='checkbox'
									checked={user?.DarkMode}
									onChange={change_dark_mode}
								/>
							}
							<label>Dark mode</label>
							
						</section>

						<section>
							<button 
								className='button button-reverse'
								onClick={() => setShow_editCredentials(true)}
							>
								<span>Anmeldedaten ändern</span>
							</button>
						</section>


						<section>
							<button 
								className='button button-red-reverse' 
								disabled={logoutDisabled}
								onClick={logout}
							>Ausloggen</button>
						</section>

					</div>
				
				</>}
			</div>
			
		</Popup>
	</>)

}
