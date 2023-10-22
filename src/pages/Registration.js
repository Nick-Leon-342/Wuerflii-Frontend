

import '../App.css'
import './css/Registration.css'

import { useRef, useState, useEffect } from 'react'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../api/axios'
import useAuth from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import { resizeEvent, NAME_REGEX, PASSWORD_REGEX } from './utils'

const REGISTER_URL = '/auth/registration'

const Registration = () => {

	const nameRef = useRef()
	const errRef = useRef()
	const navigate = useNavigate()
	const { setAuth } = useAuth()

	const [Name, setName] = useState('')
	const [validName, setValidName] = useState(false)
	const [nameFocus, setNameFocus] = useState(false)

	const [Password, setPassword] = useState('')
	const [validPassword, setValidPassword] = useState(false)
	const [passwordFocus, setPasswordFocus] = useState(false)

	const [matchPassword, setMatchPassword] = useState('')
	const [validMatch, setValidMatch] = useState(false)
	const [matchFocus, setMatchFocus] = useState(false)

	const [errMsg, setErrMsg] = useState('')

	useEffect(() => {setValidName(NAME_REGEX.test(Name))}, [Name])
	useEffect(() => {
		resizeEvent()
		nameRef.current.focus()
	}, [])

	useEffect(() => {
		setValidPassword(PASSWORD_REGEX.test(Password))
		setValidMatch(Password === matchPassword)
	}, [Password, matchPassword])

	useEffect(() => {setErrMsg('')}, [Name, Password, matchPassword])

	const handleSubmit = async (e) => {
		e.preventDefault()

		const v1 = NAME_REGEX.test(Name)
		const v2 = PASSWORD_REGEX.test(Password)
		if (!v1 || !v2) {
			setErrMsg('Invalid Entry')
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
			console.log(err)
			if (!err?.response) {
				setErrMsg('No Server Response')
			} else if (err.response?.status === 409) {
				setErrMsg('Username Taken')
			} else {
				setErrMsg('Registration Failed')
			}
			errRef.current.focus()
		}
	}

	return (
		<>
			<p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
			<h1>Registration</h1>

			<form onSubmit={handleSubmit}>

				<p className='input-header' htmlFor='Name'>
					Benutzername
					<FontAwesomeIcon icon={faCheck} className={validName ? 'valid' : 'hide'} />
					<FontAwesomeIcon icon={faTimes} className={validName || !Name ? 'hide' : 'invalid'} />
				</p>
				<input
					type='text'
					className='input'
					id='Name'
					placeholder='Benutzername'
					ref={nameRef}
					autoComplete='off'
					onChange={(e) => setName(e.target.value)}
					value={Name}
					required
					aria-invalid={validName ? 'false' : 'true'}
					aria-describedby='uidnote'
					onFocus={() => setNameFocus(true)}
					onBlur={() => setNameFocus(false)}
				/>
				<p id='uidnote' className={nameFocus && Name && !validName ? 'instructions' : 'offscreen'}>
					<FontAwesomeIcon icon={faInfoCircle} />
					
				</p>


				<p className='input-header' htmlFor='Password'>
					Passwort
					<FontAwesomeIcon icon={faCheck} className={validPassword ? 'valid' : 'hide'} />
					<FontAwesomeIcon icon={faTimes} className={validPassword || !Password ? 'hide' : 'invalid'} />
				</p>
				<input
					type='password'
					className='input'
					id='Password'
					placeholder='Password'
					onChange={(e) => setPassword(e.target.value)}
					value={Password}
					required
					aria-invalid={validPassword ? 'false' : 'true'}
					aria-describedby='pwdnote'
					onFocus={() => setPasswordFocus(true)}
					onBlur={() => setPasswordFocus(false)}
				/>
				<p id='pwdnote' className={passwordFocus && !validPassword ? 'instructions' : 'offscreen'}>
					<FontAwesomeIcon icon={faInfoCircle} />
					
				</p>


				<p className='input-header' htmlFor='confirm_pwd'>
					Passwort bestätigen
					<FontAwesomeIcon icon={faCheck} className={validMatch && matchPassword ? 'valid' : 'hide'} />
					<FontAwesomeIcon icon={faTimes} className={validMatch || !matchPassword ? 'hide' : 'invalid'} />
				</p>
				<input
					type='password'
					className='input'
					id='confirm_pwd'
					placeholder='Password'
					onChange={(e) => setMatchPassword(e.target.value)}
					value={matchPassword}
					required
					aria-invalid={validMatch ? 'false' : 'true'}
					aria-describedby='confirmnote'
					onFocus={() => setMatchFocus(true)}
					onBlur={() => setMatchFocus(false)}
				/>
				<p id='confirmnote' className={matchFocus && !validMatch ? 'instructions' : 'offscreen'}>
					<FontAwesomeIcon icon={faInfoCircle} />
					Die Passwörter müssen gleich sein.
				</p>
				<br/>
				<br/>

				<button className='button' style={{ width: '100%'}} disabled={!validName || !validPassword || !validMatch ? true : false}>Registrieren</button>

			</form>
			
			<p className='reglog-link-switch'>
				Bereits registriert?{' '}
				<span className='line'>
					<Link to='/'>Einloggen</Link>
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