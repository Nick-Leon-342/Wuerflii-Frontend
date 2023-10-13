

import '../App.css'
import './css/Login.css'

import React from 'react'
import { useRef, useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'

import { resizeEvent } from './utils'
import axios from '../api/axios'
const LOGIN_URL = '/auth/login'

const Login = () => {

    const { setAuth } = useAuth()

    const navigate = useNavigate()

    const userRef = useRef()
    const errRef = useRef()

    const [Name, setUser] = useState('')
    const [Password, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {setErrMsg('')}, [Name, Password])
    useEffect(() => {
		resizeEvent()
		userRef.current.focus()
	}, [])

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            const response = await axios.post(LOGIN_URL, 
				{ Name, Password },
				{
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
			)
            const accessToken = response?.data?.accessToken
            setAuth({ accessToken })
            setUser('')
            setPwd('')

            navigate('/CreateGame', { replace: true })

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response')
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password')
            } else if (err.response?.status === 401) {
                setErrMsg('Wrong username or password')
            } else {
                setErrMsg('Login Failed')
            }
            errRef.current.focus()
        }

    }

    return (
		<>
			<p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>

				<p className='input-header' htmlFor='Username'>Benutzername</p>
				<input
					type='text'
					className='input'
					id='Username'
					placeholder='Jeffrey'
					ref={userRef}
					autoComplete='off'
					onChange={(e) => setUser(e.target.value)}
					value={Name}
					required
				/>

				<p className='input-header' htmlFor='Password'>Passwort</p>
				<input
					type='password'
					className='input'
					id='Password'
					placeholder='#Pass123'
					onChange={(e) => setPwd(e.target.value)}
					value={Password}
					required
				/>

				<br/>
				<br/>

				<button className='button login'>Einloggen</button>

			</form>
			<p className='needAccount'>
				Noch keinen Account?{' '}
				<span>
					<Link to='/registration'>Erstellen</Link>
				</span>
			</p>
		</>
    )
}

export default Login
