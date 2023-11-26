

import '../App.css'

import { useState } from 'react'
import axios from '../api/axios'
import useAuth from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import { NAME_REGEX, PASSWORD_REGEX } from '../logic/utils'

import Loader from '../components/Loader'
import RegistrationForm from '../components/RegistrationForm'
import ErrorMessage from '../components/ErrorMessage'





const Registration = () => {

	const navigate = useNavigate()
	const { setAuth } = useAuth()

	const [Name, setName] = useState('')
	const [Password, setPassword] = useState('')

	const [error, setError] = useState('')
	const [loaderVisible, setLoaderVisible] = useState(false)
	const [ registrationDisabled, setRegistrationDisabled ] = useState(false)





	const handleSubmit = async (e) => {
		
		setRegistrationDisabled(true)
		setLoaderVisible(true)
		setError('')
		e.preventDefault()

		if (Name && NAME_REGEX.test(Name) && Password && PASSWORD_REGEX.test(Password)) {
			
			try {
	
				const response = await axios.post('/auth/registration', 
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

		}

		setRegistrationDisabled(false)
		setLoaderVisible(false)

	}





	return (
		<>

			<h1>Registrierung</h1>

			<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>

				<RegistrationForm Name={Name} setName={setName} Password={Password} setPassword={setPassword} isRequired={true}/>

				<Loader loaderVisible={loaderVisible} marginTop='10px'/>

				<ErrorMessage error={error}/>

				<button 
					className='button' 
					disabled={registrationDisabled}
					style={{ 
						height: '60px', 
						width: '100%', 
						fontSize: '23px' 
					}}
				>Registrieren
				</button>

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