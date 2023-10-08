

import '../App.css'
import './css/Login.css'

import { useRef, useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'

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

    useEffect(() => {userRef.current.focus()}, [])
    useEffect(() => {setErrMsg('')}, [Name, Password])

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

            navigate('/home', { replace: true })

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

        <div>
            <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>

                <label htmlFor='Username'>Benutzername:</label>
				<br/>
                <input
                    type='text'
                    id='Username'
					placeholder='Jeffrey'
                    ref={userRef}
                    autoComplete='off'
                    onChange={(e) => setUser(e.target.value)}
                    value={Name}
                    required
                />

				<br/>

                <label htmlFor='Password'>Passwort:</label>
				<br/>
                <input
                    type='password'
                    id='Password'
					placeholder='#Pass123'
                    onChange={(e) => setPwd(e.target.value)}
                    value={Password}
                    required
                />

				<br/>
				<br/>

                <button>Einloggen</button>

            </form>
            <p>
                Noch keinen Account?<br />
                <span className='line'>
                    <Link to='/registration'>Erstellen</Link>
                </span>
            </p>
        </div>

    )
}

export default Login




















// import { useRef} from 'react'
// import { Formik, Form, Field, ErrorMessage } from 'formik'
// import axios from '../api/axios'
// import { useNavigate } from 'react-router-dom'
// import * as Yup from 'yup'


// function Login() {

// 	const { setAuth } = useAuth()
// 	let navigate = useNavigate()

// 	const initialValues = {
// 		Name: '',
// 		Password: ''
// 	}

// 	const onSubmit = async (values) => {

// 		await axios.post('/auth/login', values).then((res) => {
// 			console.log(res.data)
// 		})

// 	}

// 	const validationSchema = Yup.object().shape({
// 		Name: Yup.string()
// 				.min(6, 'Der Benutzername muss mindestens 6 Zeichen lang sein!')
// 				.max(128, 'Der Benutzername darf maximal 128 Zeichen lang sein!')
// 				.required('Du musst einen Benutzernamen eingeben!'),
// 		Password: Yup.string()
// 					.min(6, 'Das Passwort muss aus mindestens 6 Zeichen bestehen!')
// 					.max(128, 'Das Passwort darf maximal 128 Zeichen lang sein!')
// 					.required('Du musst ein Passwort eingeben!')
// 	})


// 	const navigateEvent = () => {navigate('/registration')}

// 	return (
// 		<div>

// 			<button onClick={navigateEvent}>Registration</button>

// 			<br/>
// 			<br/>

// 			<Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
// 				<Form>

// 					<label>Benutzername: </label>
// 					<br/>
// 					<ErrorMessage name='Name' />
// 					<br/>
// 					<Field id='username' name='Name' placeholder='username' />
// 					<br />


// 					<label>Passwort: </label>
// 					<br/>
// 					<ErrorMessage name='Password' />
// 					<br/>
// 					<Field id='password' name='Password' placeholder='password' type='password' />
// 					<br />
// 					<br />


// 					<button type='submit'>Einloggen</button>

// 				</Form>
// 			</Formik>

// 		</div>
// 	)
// }

// export default Login