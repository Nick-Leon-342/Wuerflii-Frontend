

import '../App.css'
import './css/Login.css'

import React from 'react'
import { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'

import { resizeEvent } from './utils'
import axios from '../api/axios'





const Login = () => {

    const { setAuth } = useAuth()

    const navigate = useNavigate()

    const [Name, setName] = useState('')
    const [Password, setPassword] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {resizeEvent()}, [])





    const handleSubmit = async (e) => {

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

    }




	
    return (
		<>
			<h1>Anmeldung</h1>

			<form onSubmit={handleSubmit}>

				<p htmlFor='Username' className='input-header' style={{ color: 'black', height: '25px', marginTop: '20px', display: 'flex' }}>
					<span style={{ height: '100%', marginLeft: '7px', marginRight: '5px' }}>Benutzername</span>
				</p>
				<input
					type='text'
					id='Username'
					placeholder='Benutzername'
					autoComplete='off'
					onChange={(e) => setName(e.target.value)}
					value={Name}
					required
				/>

				<p htmlFor='Password' className='input-header' style={{ color: 'black', height: '25px', marginTop: '20px', display: 'flex' }}>
					<span style={{ height: '100%', marginLeft: '7px', marginRight: '5px' }}>Passwort</span>
				</p>
				<input
					type='password'
					id='Password'
					placeholder='Password'
					onChange={(e) => setPassword(e.target.value)}
					value={Password}
					required
				/>

				<br/>
				<br/>

				<p style={{
					display: error ? '' : 'none',
					border: '2px solid rgb(255, 0, 0)',
					borderRadius: '10px',
					color: 'rgb(255, 0, 0)',
					fill: 'rgb(255, 0, 0)',
					padding: '20px',
				}}>
					<span style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
						<svg height="20" viewBox="0 -960 960 960"><path fill='rgb(255, 0, 0)' d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
						<span style={{ height: '100%', fontSize: '19px', margin: 'auto', marginLeft: '5px', color: 'rgb(255, 0, 0)' }}>Fehler</span>
					</span>
					<span style={{ display: 'flex' }}>{error}</span>
				</p>

				<button className='button' style={{ height: '40px', width: '100%'}}>Anmelden</button>

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
