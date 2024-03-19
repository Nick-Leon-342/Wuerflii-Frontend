

import './css/Login.css'

import React from 'react'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'

import Loader from '../components/Loader'
import FancyInput from '../components/FancyInput'
import ErrorMessage from '../components/ErrorMessage'
import OptionsDialog from '../components/Dialog/OptionsDialog'
import CustomLink from '../components/NavigationElements/CustomLink'





export default function Login() {

    const { setAuth } = useAuth()

    const navigate = useNavigate()

    const [ Name, setName ] = useState('')
    const [ Password, setPassword ] = useState('')
    const [ error, setError ] = useState('')
	const [ loaderVisible, setLoaderVisible ] = useState(false)
	const [ loginDisabled, setLoginDisabled ] = useState(false)





    const handleSubmit = async (e) => {

		setLoginDisabled(true)
		setLoaderVisible(true)
		setError('')



		await axios.post('/auth/login', { Name, Password }).then(({ data }) => {

			setAuth({ accessToken: data.accessToken })
			setName('')
			setPassword('')

			navigate('/selectsession', { replace: true })

		}).catch((err) => {

			if (!err?.response) {
				setError('Der Server antwortet nicht!')
			} else if (err.response?.status === 401) {
				setError('Falscher Benutzername \noder falsches Passwort!')
			} else {
				setError('Die Anmeldung hat nicht funktioniert!')
			}

		})


		
		setLoginDisabled(false)
		setLoaderVisible(false)

    }




	
    return (
		<>

			<OptionsDialog/>

			<h1 className='login_title'>Anmeldung</h1>



			<form onSubmit={handleSubmit} className='login_container'>

				<FancyInput 
					id='Username' 
					type='text' 
					text='Benutzername' 
					value={Name} 
					setValue={setName} 
					isRequired={true}
				/>

				<FancyInput 
					id='Password' 
					type='password' 
					classNames='login_input'
					text='Passwort' 
					value={Password} 
					setValue={setPassword} 
					isRequired={true}
				/>

				<Loader loaderVisible={loaderVisible}/>

				<ErrorMessage error={error}/>

				<button 
					className='button button-thick' 
					disabled={loginDisabled}
				>Anmelden</button>

			</form>



			<CustomLink linkTo='/registration' text='Account erstellen'/>
			
		</>
    )
}
