

import './scss/Registration_And_Login.scss'

import packageJson from '../../../package.json'
import { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import { axiosDefault } from '../../api/axios'
import { ErrorContext } from '../../context/Error'
import { RegexContext } from '../../context/Regex'
import useErrorHandling from '../../hooks/useErrorHandling'

import CustomButton from '../../components/misc/Custom_Button'
import InputWithSVG from '../../components/misc/Input_With_SVG'
import RegistrationForm from '../../components/misc/Form__Username_And_Password'
import CustomLink from '../../components/NavigationElements/CustomLink'

import { ReactComponent as Key } from '../../svg/Key.svg'
import { ReactComponent as Icon } from '../../svg/default.svg'
import { ReactComponent as Person } from '../../svg/Person.svg'

import { UniversalLoaderContext } from '../../context/Universal_Loader'





export default function Registration_And_Login() {

    const { setAuth } = useAuth()
	const location = useLocation()
    const navigate = useNavigate()
	const [ next, setNext ] = useState('')
	const handle_error = useErrorHandling()

	const { setError } = useContext(ErrorContext)
	const { NAME_REGEX, PASSWORD_REGEX } = useContext(RegexContext)
	const { setLoading__universal_loader } = useContext(UniversalLoaderContext)

    const [ name, 				setName				] = useState('')
    const [ password, 			setPassword			] = useState('')
    const [ password_confirm,	setPassword_confirm	] = useState('')
	
	const [ loading, 			setLoading			] = useState(false)

	const [ show_login, 		setShow_login		] = useState(true)






	useEffect(() => {

		setError('')
		setName('')
		setPassword('')

		// eslint-disable-next-line
	}, [ show_login ])

	useEffect(() => {
		setLoading__universal_loader(false)
		setNext(new URLSearchParams(location.search).get('next'))
		// eslint-disable-next-line
	}, [])

	useEffect(() => setError(''), [ name, password, setError ])





    const handleSubmit = event => {

		event.preventDefault()
		if(show_login) {
			login()
		} else {
			registration()
		}

    }

	const registration = () => {
		
		if(!name || !NAME_REGEX.test(name) || !password || !PASSWORD_REGEX.test(password)) return setError('Bitte alles richtig ausfüllen.')
		if(password !== password_confirm) return setError('Passwörter stimmen nicht überein.')
		setLoading(true)
		setError('')


		axiosDefault.post('/auth/registration', 
			{ 
				Name: name, 
				Password: password, 
			}, {
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		).then(({ data }) => {


			setAuth({ accessToken: data.accessToken })
			setName('')
			setPassword('')

			navigate('/session', { replace: true })


		}).catch((err) => {

			handle_error({
				err, 
				handle_409: () => {
					setError('Der Benutzername ist vergeben!')
				}
			})

		}).finally(() => setLoading(false))

	}

	const login = () => {

		setLoading(true)
		setError('')


		axiosDefault.post('/auth/login', 
			{ 
				Name: name, 
				Password: password, 
			}, {
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		).then(({ data }) => {


			setAuth({ accessToken: data.accessToken })
			setName('')
			setPassword('')

			navigate(next || '/', { replace: true })


		}).catch((err) => {

			handle_error({
				err, 
				handle_409: () => {
					setError('Falscher Benutzername oder falsches Passwort!')
				}
			})

		}).finally(() => setLoading(false))

	}




	
    return <>
		<div className='registration_and_login'>

			<div className='registration_and_login--logo_container'>

				<div className='registration_and_login--logo'>
					<Icon/>
					<h1>Wuerflii</h1>
				</div>
				<div className='registration_and_login--version'>
					<span>v_{packageJson.version}</span>
				</div>

			</div>


			<div className='registration_and_login--line'/>


			<div className='registration_and_login--page'>

				<form onSubmit={handleSubmit}>

					{show_login && <>

						<InputWithSVG
							type='text'
							value={name}
							SVG={<Person/>}
							isRequired={true}
							name='Benutzername'
							onValueChange={({ target }) => setName(target.value)}
						/>

						<InputWithSVG
							SVG={<Key/>}
							type='password'
							name='Passwort'
							value={password}
							isRequired={true}
							onValueChange={({ target }) => setPassword(target.value)}
						/>

					</>}



					{!show_login && <>

						<RegistrationForm 
							name={name} 
							setName={setName} 
							
							password={password} 
							setPassword={setPassword} 
	
							password_confirm={password_confirm}
							setPassword_confirm={setPassword_confirm}

							isRequired={true}
						/>

					</>}



					<CustomButton 
						text={show_login ? 'Anmelden' : 'Registrieren'}
						loading={loading}
					/>

				</form>



				<CustomLink 
					text={show_login ? 'Erstellen' : 'Anmelden'}
					textBefore={show_login ? 'Noch keinen Account?' : 'Bereits einen Account?'}
					onClick={() => setShow_login(prev => !prev)}
				/>
				
			</div>

		</div>
	</>
}
