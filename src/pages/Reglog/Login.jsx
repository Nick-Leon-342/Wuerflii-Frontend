

import './scss/Reglog.scss'

import { useState } from 'react'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import axios from '../../api/axios'
import useAuth from '../../hooks/useAuth'
import useErrorHandling from '../../hooks/useErrorHandling'

import PopupError from '../../components/Popup/Popup_Error'
import FancyInput from '../../components/others/FancyInput'
import CustomButton from '../../components/others/Custom_Button'
import CustomLink from '../../components/NavigationElements/CustomLink'





export default function Login() {

    const { setAuth } = useAuth()
	const location = useLocation()
	const [ next, setNext ] = useState('')
	const handle_error = useErrorHandling()

    const navigate = useNavigate()

    const [ Name, setName ] = useState('')
    const [ Password, setPassword ] = useState('')
    const [ error, setError ] = useState('')
	const [ loading, setLoading ] = useState(false)





	
	// eslint-disable-next-line
	useEffect(() => setNext(new URLSearchParams(location.search).get('next')), [])

	useEffect(() => setError(''), [ Name, Password ])

    const handleSubmit = (e) => {

		e.preventDefault()
		setLoading(true)
		setError('')



		axios.post('/auth/login', 
			{ Name, Password }, 
			{
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		).then(({ data }) => {


			setAuth({ accessToken: data.accessToken })
			setName('')
			setPassword('')

			navigate(next || '/session/select', { replace: true })


		}).catch((err) => {

			handle_error({
				err, 
				handle_409: () => {
					setError('Falscher Benutzername \noder falsches Passwort!')
				}
			})

		}).finally(() => setLoading(false))

    }




	
    return (
		<div className='reglog-page'>

			<h1>Anmeldung</h1>

			<PopupError
				error={error}
				setError={setError}
			/>



			<form onSubmit={handleSubmit}>

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
					text='Passwort' 
					value={Password} 
					setValue={setPassword} 
					isRequired={true}
				/>

				<CustomButton 
					text='Anmelden'
					loading={loading}
				/>

			</form>



			<CustomLink 
				text='Erstellen' 
				textBefore='Noch keinen Account?'
				onClick={() => navigate('/registration', { replace: false })}
			/>
			
		</div>
    )
}
