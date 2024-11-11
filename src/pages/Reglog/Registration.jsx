

import './scss/Reglog.scss'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from '../../api/axios'
import useAuth from '../../hooks/useAuth'
import useErrorHandling from '../../hooks/useErrorHandling'

import ErrorMessage from '../../components/others/ErrorMessage'
import CustomButton from '../../components/others/Custom_Button'
import RegistrationForm from '../../components/others/RegistrationForm'
import CustomLink from '../../components/NavigationElements/CustomLink'





export default function Registration() {

	const navigate = useNavigate()
	const { setAuth } = useAuth()
	const handle_error = useErrorHandling()

	const [ Name, setName ] = useState('')
	const [ Password, setPassword ] = useState('')

	const [ error, setError ] = useState('')
	const [ loading, setLoading ] = useState(false)

	const [ NAME_REGEX, setNAME_REGEX ] = useState()
	const [ PASSWORD_REGEX, setPASSWORD_REGEX ] = useState()





	const handleSubmit = (e) => {
		
		e.preventDefault()
		setLoading(true)
		setError('')
		


		if(!Name || !NAME_REGEX.test(Name) || !Password || !PASSWORD_REGEX.test(Password)) return setError('')
			
		axios.post('/auth/registration', 
			{ Name, Password },  
			{
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		).then(({ data }) => {


			setAuth({ accessToken: data.accessToken })
			setName('')
			setPassword('')

			navigate('/game/create', { replace: true })


		}).catch((err) => {

			handle_error({
				err, 
				handle_409: () => {
					setError('Der Benutzername ist vergeben!')
				}
			})

		}).finally(() => setLoading(false))

	}





	return (
		<div className='reglog-page'>

			<h1>Registrierung</h1>



			<form onSubmit={handleSubmit}>

				<RegistrationForm 
					Name={Name} 
					setName={setName} 
					Password={Password} 
					setPassword={setPassword} 
					isRequired={true}
					NAME_REGEX={NAME_REGEX}
					setNAME_REGEX={setNAME_REGEX}
					PASSWORD_REGEX={PASSWORD_REGEX}
					setPASSWORD_REGEX={setPASSWORD_REGEX}
				/>

				<ErrorMessage error={error}/>

				<CustomButton
					text='Registrieren' 
					loading={loading}
				/>

			</form>



			<CustomLink 
				text='Anmelden' 
				textBefore='Bereits einen Account?'
				onClick={() => navigate('/login', { replace: false })}
			/>

		</div>
	)

}
