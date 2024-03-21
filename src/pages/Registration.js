

import './css/Registration.css'

import { useState } from 'react'
import axios from '../api/axios'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { NAME_REGEX, PASSWORD_REGEX } from '../logic/utils-env'

import Loader from '../components/Loader'
import RegistrationForm from '../components/RegistrationForm'
import ErrorMessage from '../components/ErrorMessage'
import OptionsDialog from '../components/Dialog/OptionsDialog'
import CustomLink from '../components/NavigationElements/CustomLink'





export default function Registration() {

	const navigate = useNavigate()
	const { setAuth } = useAuth()

	const [Name, setName] = useState('')
	const [Password, setPassword] = useState('')

	const [error, setError] = useState('')
	const [loaderVisible, setLoaderVisible] = useState(false)
	const [ registrationDisabled, setRegistrationDisabled ] = useState(false)





	const handleSubmit = async (e) => {
		
		e.preventDefault()
		setRegistrationDisabled(true)
		setLoaderVisible(true)
		setError('')
		


		if(Name && NAME_REGEX.test(Name) && Password && PASSWORD_REGEX.test(Password)) {
			
			await axios.post('/auth/registration', 
				{ Name, Password },  
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			).then(({ data }) => {

				setAuth({ accessToken: data.accessToken })
				setName('')
				setPassword('')
	
				navigate('/creategame', { replace: true })

			}).catch((err) => {
				
				if (!err?.response) {
					setError('Der Server antwortet nicht!')
				} else if (err.response?.status === 409) {
					setError('Der Benutzername ist vergeben!')
				} else {
					setError('Die Registration schlug fehl!')
					console.log(err)
				}

			})

		}



		setRegistrationDisabled(false)
		setLoaderVisible(false)

	}





	return (
		<>

			<OptionsDialog/>

			<h1 className='registration_title'>Registrierung</h1>



			<form onSubmit={handleSubmit} className='registration_container'>

				<RegistrationForm 
					Name={Name} 
					setName={setName} 
					Password={Password} 
					setPassword={setPassword} isRequired={true}
				/>

				<Loader loaderVisible={loaderVisible}/>

				<ErrorMessage error={error}/>

				<button 
					className='button button-thick' 
					disabled={registrationDisabled}
				>Registrieren</button>

			</form>



			<CustomLink linkTo='/creategame' text='Anmelden'/>

		</>
	)

}
