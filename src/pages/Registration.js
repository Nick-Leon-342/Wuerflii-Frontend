

import './scss/Reglog.scss'

import { useState } from 'react'
import axios from '../api/axios'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

import ErrorMessage from '../components/others/ErrorMessage'
import CustomButton from '../components/others/Custom_Button'
import RegistrationForm from '../components/others/RegistrationForm'
import CustomLink from '../components/NavigationElements/CustomLink'





export default function Registration() {

	const navigate = useNavigate()
	const { setAuth } = useAuth()

	const [ Name, setName ] = useState('')
	const [ Password, setPassword ] = useState('')

	const [ error, setError ] = useState('')
	const [ loading, setLoading ] = useState(false)

	const [ NAME_REGEX, setNAME_REGEX ] = useState()
	const [ PASSWORD_REGEX, setPASSWORD_REGEX ] = useState()





	const handleSubmit = async (e) => {
		
		e.preventDefault()
		setLoading(true)
		setError('')
		


		if(!Name || !NAME_REGEX.test(Name) || !Password || !PASSWORD_REGEX.test(Password)) return setError('')
			
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

		}).finally(() => { setLoading(false) })

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
				onClick={() => navigate('/login', { replace: false })}
				text='Anmelden' 
				textBefore='Bereits einen Account?'
			/>

		</div>
	)

}
