

import '../App.css'

import { useState, useEffect } from 'react'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../api/axios'
import useAuth from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import { resizeEvent, NAME_REGEX, PASSWORD_REGEX } from './utils'

import DialogName from '../dialog/DialogName'
import DialogPassword from '../dialog/DialogPassword'
import DialogPasswordMatch from '../dialog/DialogPasswordMatch'




const REGISTER_URL = '/auth/registration'

const Registration = () => {

	const navigate = useNavigate()
	const { setAuth } = useAuth()

	const [Name, setName] = useState('')
	const [infoName, setInfoName] = useState(false)

	const [Password, setPassword] = useState('')
	const [infoPassword, setInfoPassword] = useState(false)

	const [matchPassword, setMatchPassword] = useState('')
	const [infoPasswordMatch, setInfoPasswordMatch] = useState(false)

	const [error, setError] = useState('')
	const [loaderVisible, setLoaderVisible] = useState(false)

	useEffect(() => {resizeEvent()}, [])





	const handleSubmit = async (e) => {
		
		setLoaderVisible(true)
		setError('')
		e.preventDefault()

		if(!Name || !Password || !matchPassword) return
		if (!NAME_REGEX.test(Name) || !PASSWORD_REGEX.test(Password)) {
			setError('Invalid Entry')
			return
		}

		try {

			const response = await axios.post(REGISTER_URL, 
				JSON.stringify({ Name, Password }),
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
			} else if (err.response?.status === 409) {
				setError('Der Benutzername ist vergeben!')
			} else {
				setError('Die Registration schlug fehl!')
			}
		}
		setLoaderVisible(false)

	}





	return (
		<>
			<h1>Registrierung</h1>

			<form onSubmit={handleSubmit}>

				<p htmlFor='Username' className='input-header' style={{ color: 'black', height: '25px', marginTop: '20px', display: 'flex' }}>
					<span style={{ height: '100%', marginLeft: '7px', marginRight: '5px' }}>Benutzernamen</span>
					<svg 
						height='20' 
						viewBox='0 -960 960 960'
						style={{
							fill: 'rgb(0, 255, 0',
							display: Name && NAME_REGEX.test(Name) ? '' : 'none',
						}}
					><path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/></svg>
					<svg 
						height='20' 
						viewBox='0 -960 960 960'
						style={{
							fill: 'rgb(255, 0, 0)',
							display: Name && !NAME_REGEX.test(Name) ? '' : 'none',
						}}
					><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
				</p>
				<input
					id='Username'
					type='text'
					placeholder='Benutzername'
					autoComplete='off'
					onChange={(e) => setName(e.target.value)}
					value={Name}
					required
					onFocus={() => setInfoName(true)}
					onBlur={() => setInfoName(false)}
				/>
				{infoName && Name && !NAME_REGEX.test(Name) && <DialogName/>}


				<p htmlFor='Password' className='input-header' style={{ color: 'black', height: '25px', marginTop: '20px', display: 'flex' }}>
					<span style={{ height: '100%', marginLeft: '7px', marginRight: '5px' }}>Passwort</span>
					<svg 
						height='20' 
						viewBox='0 -960 960 960'
						style={{
							fill: 'rgb(0, 255, 0',
							display: Password && PASSWORD_REGEX.test(Password) ? '' : 'none',
						}}
					><path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/></svg>
					<svg 
						height='20' 
						viewBox='0 -960 960 960'
						style={{
							fill: 'rgb(255, 0, 0)',
							display: Password && !PASSWORD_REGEX.test(Password) ? '' : 'none',
						}}
					><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
				</p>
				<input
					type='password'
					id='Password'
					placeholder='Password'
					onChange={(e) => setPassword(e.target.value)}
					value={Password}
					required
					onFocus={() => setInfoPassword(true)}
					onBlur={() => setInfoPassword(false)}
				/>
				{infoPassword && Password && !PASSWORD_REGEX.test(Password) && <DialogPassword/>}


				<p htmlFor='matchPassword' className='input-header' style={{ color: 'black', height: '25px', marginTop: '20px', display: 'flex' }}>
					<span style={{ height: '100%', marginLeft: '7px', marginRight: '5px' }}>Passwort bestätigen</span>
					<svg 
						height='20' 
						viewBox='0 -960 960 960'
						style={{
							fill: 'rgb(0, 255, 0',
							display: matchPassword && Password === matchPassword ? '' : 'none',
						}}
					><path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/></svg>
					<svg 
						height='20' 
						viewBox='0 -960 960 960'
						style={{
							fill: 'rgb(255, 0, 0)',
							display: matchPassword && Password !== matchPassword ? '' : 'none',
						}}
					><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
				</p>
				<input
					type='password'
					id='matchPassword'
					placeholder='Password'
					onChange={(e) => setMatchPassword(e.target.value)}
					value={matchPassword}
					required
					onFocus={() => setInfoPasswordMatch(true)}
					onBlur={() => setInfoPasswordMatch(false)}
				/>
				{infoPasswordMatch && !PASSWORD_REGEX.test(matchPassword) && Password !== matchPassword && <DialogPasswordMatch/>}

				<br/>
				<br/>
				<div className={`loader ${loaderVisible ? '' : 'notVisible'}`}>
					<span/>
					<span/>
					<span/>
				</div>

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

				<button className='button' style={{ height: '40px', width: '100%'}}>Registrieren</button>

			</form>
			
			<p className='reglog-link-switch'>
				Bereits registriert?{' '}
				<span className='line'>
					<Link to='/'>Anmelden</Link>
				</span>
			</p>
		</>

	)

}

export default Registration

























// import React from 'react'
// import { Formik, Form, Field, ErrorMessage } from 'formik'
// import axios from '../api/axios'
// import { useNavigate } from 'react-router-dom'
// import * as Yup from 'yup'


// function Registration() {

// 	let navigate = useNavigate()

// 	const initialValues = {
// 		Name: '',
// 		Password: ''
// 	}

// 	const onSubmit = (values) => {

// 		axios.post('/auth/registration', values).then((res) => {
// 			if(res.status === 201) {
// 				navigate('/login')
// 			}
// 		})

// 	}

// 	const validationSchema = Yup.object().shape({
// 		Name: Yup.string()
// 				.min(6, 'Der Benutzername muss mindestens 6 Zeichen lang sein!')
// 				.max(128, 'Der Benutzername darf maximal 128 Zeichen lang sein!')
// 				.required('Du musst einen Benutzernamen eingeben!'),
// 		Password: Yup.string()
// 				.min(6, 'Das Passwort muss aus mindestens 6 Zeichen bestehen!')
// 				//  .minLowerCase(1, 'Der Benutzername muss aus mindestens einem Kleinbuchstaben bestehen!')
// 				// .minUpperCase(1, 'Der Benutzername muss aus mindestens einem Großuchstaben bestehen!')
// 				// .minNumbers(1, 'Der Benutzername muss aus mindestens einer Zahl bestehen!')
// 				.max(128, 'Das Passwort darf maximal 128 Zeichen lang sein!')
// 				.required('Du musst ein Passwort eingeben!')
// 	})

// 	const navigateEvent = () => {navigate('/login')}

// 	return (
// 		<div>

// 			<button onClick={navigateEvent}>Login</button>

// 			<br/>
// 			<br/>

// 			<Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
// 				<Form>

// 					<label>Benutzername: </label>
// 					<br/>
// 					<ErrorMessage name='Name' />
// 					<br/>
// 					<Field id='username' name='Name' placeholder='username' />
// 					<br/>


// 					<label>Passwort: </label>
// 					<br/>
// 					<ErrorMessage name='Password' />
// 					<br/>
// 					<Field id='password' name='Password' placeholder='password' type='password' />
// 					<br/>


// 					<label>Passwort bestätigen: </label>
// 					<br/>
// 					<ErrorMessage name='ConfirmPassword' />
// 					<br/>
// 					<Field id='confirmPassword' name='ConfirmPassword' placeholder='confirm password' type='password' />
// 					<br/>
// 					<br />


// 					<button type='submit'>Registrieren</button>

// 				</Form>
// 			</Formik>

// 		</div>
// 	)
// }

// export default Registration




// // const validatePassword = values => {
// //   let error = ''
// //   const passwordRegex = /(?=.*[0-9])/
// //   if (!values) {
// //     error = '*Required'
// //   } else if (values.length < 8) {
// //     error = '*Password must be 8 characters long.'
// //   } else if (!passwordRegex.test(values)) {
// //     error = '*Invalid password. Must contain one number.'
// //   }
// //   return error
// // }

// // const validateConfirmPassword = (pass, value) => {

// //   let error = ''
// //   if (pass && value) {
// //     if (pass !== value) {
// //       error = 'Password not matched'
// //     }
// //   }
// //   return error
// // }

// //  <Field type='password' name='password' validate={validatePassword} />

// //  {errors.password && <div>{errors.password}</div>}

// //  <Field type='password' name='confirmPassword' validate={value =>
// //               validateConfirmPassword(values.password, value)
// //             }/>

// //  {errors.confirmPassword && (<div>{errors.confirmPassword}</div>)}