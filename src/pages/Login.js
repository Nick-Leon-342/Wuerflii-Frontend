

import '../App.css'

import React from 'react'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../api/axios'

import Loader from '../components/Loader'
import FancyInput from '../components/FancyInput'
import ErrorMessage from '../components/ErrorMessage'
import OptionsDialog from '../components/Dialog/OptionsDialog'





const Login = () => {

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
        e.preventDefault()

        try {

            const response = await axios.post('/auth/login', 
				{ Name, Password },
				{
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
			)
            const accessToken = response?.data?.accessToken
            setAuth({ accessToken })
            setName('')
            setPassword('')

            navigate('/CreateGame', { replace: true })

        } catch (err) {
            if (!err?.response) {
                setError('Der Server antwortet nicht!')
            } else if (err.response?.status === 401) {
                setError('Falscher Benutzername \noder falsches Passwort!')
            } else {
                setError('Die Anmeldung hat nicht funktioniert!')
            }
        }

		setLoginDisabled(false)
		setLoaderVisible(false)

    }




	
    return (
		<>

			<OptionsDialog/>

			<h1>Anmeldung</h1>

			<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>

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
				y/>

				<Loader loaderVisible={loaderVisible}/>

				<ErrorMessage error={error}/>

				<button 
					className='button' 
					disabled={loginDisabled}
					style={{ 
						height: '60px', 
						width: '100%', 
						fontSize: '23px' 
					}}
				>Anmelden
				</button>

			</form>

			<p className='reglog-link-switch'>
				Noch keinen Account?{' '}
				<span>
					<Link to='/registration'>Erstellen</Link>
				</span>
			</p>
			
		</>
    )
}

export default Login
