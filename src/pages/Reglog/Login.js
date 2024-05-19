

import './scss/Reglog.scss'

import React, { useEffect } from 'react'
import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../../api/axios'

import FancyInput from '../../components/others/FancyInput'
import ErrorMessage from '../../components/others/ErrorMessage'
import CustomButton from '../../components/others/Custom_Button'
import CustomLink from '../../components/NavigationElements/CustomLink'





export default function Login() {

    const { setAuth } = useAuth()
	const location = useLocation()
	const [ next, setNext ] = useState('')

    const navigate = useNavigate()

    const [ Name, setName ] = useState('')
    const [ Password, setPassword ] = useState('')
    const [ error, setError ] = useState('')
	const [ loading, setLoading ] = useState(false)





	
	useEffect(() => { setNext(new URLSearchParams(location.search).get('next')) }, [])

	useEffect(() => { setError('') }, [ Name, Password ])

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

			if (!err?.response) {
				setError('Der Server antwortet nicht!')
			} else if (err.response?.status === 401) {
				setError('Falscher Benutzername \noder falsches Passwort!')
			} else {
				setError('Die Anmeldung hat nicht funktioniert!')
			}

		}).finally(() => { setLoading(false) })

    }




	
    return (
		<div className='reglog-page'>

			<h1>Anmeldung</h1>



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

				<ErrorMessage error={error}/>

				<CustomButton 
					text='Anmelden'
					loading={loading}
				/>

			</form>



			<CustomLink 
				onClick={() => navigate('/registration', { replace: false })}
				text='Erstellen' 
				textBefore='Noch keinen Account?'
			/>
			
		</div>
    )
}
