

import './scss/Reglog.scss'

import packageJson from '../../../package.json'
import { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import { axiosDefault } from '../../api/axios'
import { ErrorContext } from '../../context/Error'
import useErrorHandling from '../../hooks/useErrorHandling'

import FancyInput from '../../components/others/FancyInput'
import CustomButton from '../../components/others/Custom_Button'
import CustomLink from '../../components/NavigationElements/CustomLink'
import RegistrationForm from '../../components/others/RegistrationForm'

import { ReactComponent as Icon } from '../../svg/default.svg'





export default function Reglog() {

    const { setAuth } = useAuth()
	const location = useLocation()
    const navigate = useNavigate()
	const [ next, setNext ] = useState('')
	const handle_error = useErrorHandling()

	const { setError } = useContext(ErrorContext)

    const [ Name, setName ] = useState('')
    const [ Password, setPassword ] = useState('')

	const [ NAME_REGEX, setNAME_REGEX ] = useState()
	const [ PASSWORD_REGEX, setPASSWORD_REGEX ] = useState()
	
	const [ loading, setLoading ] = useState(false)
	const [ requesting_regex, setRequesting_regex ] = useState(false)

	const [ show_login, setShow_login ] = useState(true)





	
	useEffect(() => {

		setError('')
		setName('')
		setPassword('')

		// eslint-disable-next-line
	}, [ show_login ])

	// eslint-disable-next-line
	useEffect(() => setNext(new URLSearchParams(location.search).get('next')), [])

	useEffect(() => setError(''), [ Name, Password, setError ])

    const handleSubmit = event => {

		event.preventDefault()
		if(show_login) {
			login()
		} else {
			registration()
		}

    }

	const registration = () => {
		
		if(!Name || !NAME_REGEX.test(Name) || !Password || !PASSWORD_REGEX.test(Password)) return setError('Bitte alles richtig ausfüllen!')		
		setLoading(true)
		setError('')


		axiosDefault.post('/auth/registration', 
			{ Name, Password },  
			{
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
			{ Name, Password }, 
			{
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
		<div className='reglog'>

			<div className='reglog-logo_container'>

				<div className='reglog-logo'>
					<Icon/>
					<h1>Wuerflii</h1>
				</div>
				<div className='reglog-version'>
					<span>v_{packageJson.version}</span>
				</div>

			</div>


			<div className='reglog-line'/>


			<div className='reglog-page'>

				<form onSubmit={handleSubmit}>

					{show_login && <>

						<FancyInput 
							id='Username' 
							type='text' 
							text='Benutzername' 
							value={Name} 
							isRequired={true}
							onChange={({ target }) => setName(target.value)} 
						/>

						<FancyInput 
							id='Password' 
							type='password' 
							text='Passwort' 
							value={Password} 
							isRequired={true}
							onChange={({ target }) => setPassword(target.value)} 
						/>

					</>}



					{!show_login && <>

						<RegistrationForm 
							Name={Name} 
							setName={setName} 
							
							Password={Password} 
							setPassword={setPassword} 
	
							requesting_regex={requesting_regex}
							setRequesting_regex={setRequesting_regex}
	
							isRequired={true}
							NAME_REGEX={NAME_REGEX}
							setNAME_REGEX={setNAME_REGEX}
							PASSWORD_REGEX={PASSWORD_REGEX}
							setPASSWORD_REGEX={setPASSWORD_REGEX}
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
