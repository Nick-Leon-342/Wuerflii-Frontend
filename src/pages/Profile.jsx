

import './Profile.scss'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useErrorHandling from '../hooks/useErrorHandling'

import ErrorMessage from '../components/others/ErrorMessage'
import CustomButton from '../components/others/Custom_Button'
import Previous from '../components/NavigationElements/Previous'
import RegistrationForm from '../components/others/RegistrationForm'





export default function Profile() {
	
	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ Name, setName ] = useState('')
	const [ Password, setPassword ] = useState('')
	const [ error, setError ] = useState('')
	const [ loading_credentials, setLoading_credentials ] = useState(false)
	const [ successfullyUpdated, setSuccessfullyUpdated ] = useState(false)

	const [ NAME_REGEX, setNAME_REGEX ] = useState('')
	const [ PASSWORD_REGEX, setPASSWORD_REGEX ] = useState('')

	const [ loading_delete_account, setLoading_delete_account ] = useState(false)





	const handleSubmit = (e) => {

		e.preventDefault()
		setError('')

		if ((Name && !NAME_REGEX.test(Name)) || (Password && !PASSWORD_REGEX.test(Password)) || (!Name && !Password)) return


		let json = {}
		if(NAME_REGEX.test(Name) && PASSWORD_REGEX.test(Password)) {
			//Name and Password are valid
			json.Name = Name
			json.Password = Password
		} else if(NAME_REGEX.test(Name)) {
			//Name is valid, password not entered
			json.Name = Name
		} else {
			//Password is valid, name not entered
			json.Password = Password
		}

		setLoading_credentials(true)

		axiosPrivate.patch('/user', json).then(() => {

			setSuccessfullyUpdated(true)
			setName('')
			setPassword('')

		}).catch((err) => {

			handle_error({
				err,
				handle_409: () => {
					setError('Name bereits vergeben!')
				}
			})

		}).finally(() => setLoading_credentials(false))

	}

	const delete_account = () => {

		if(!window.confirm('Sicher, dass du deinen Account löschen willst?\nDas kann man nicht rückgängig machen!')) return
		if(!window.confirm('Wirklich, ganz sicher?')) return

		setLoading_delete_account(true)

		axiosPrivate.delete('/user').then(() => {

			navigate('/', { replace: true })

		}).catch(err => {

			handle_error({
				err, 
			})

		}).finally(() => setLoading_delete_account(false))
	}





	return (<>
		<div className='profile'>

			<Previous onClick={() => navigate(-1, { replace: true })}/>

			<form onSubmit={handleSubmit}>

				{!successfullyUpdated && <h2>Erfolgreich gespeichert!</h2>}

				<RegistrationForm 
					Name={Name} 
					setName={setName} 
					Password={Password} 
					setPassword={setPassword} 
					isRequired={false}
					NAME_REGEX={NAME_REGEX}
					setNAME_REGEX={setNAME_REGEX}
					PASSWORD_REGEX={PASSWORD_REGEX}
					setPASSWORD_REGEX={setPASSWORD_REGEX}
				/>

				<ErrorMessage error={error}/>

				<CustomButton
					text='Speichern'
					loading={loading_credentials}
				/>

			</form>




			<CustomButton
				text='Account löschen'
				onClick={delete_account}
				className='button-red-reverse'
				loading={loading_delete_account}
			/>

		</div>
	</>)
}
