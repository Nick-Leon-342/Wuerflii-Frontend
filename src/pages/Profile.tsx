

import './scss/Profile.scss'

import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { ErrorContext } from '../context/Provider__Error'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useErrorHandling from '../hooks/useErrorHandling'

import LoaderDots from '../components/Loader/Loader_Dots'
import PopupOptions from '../components/Popup/Popup_Options'
import CustomButton from '../components/misc/Custom_Button'
import Previous from '../components/NavigationElements/Previous'
import RegistrationForm from '../components/misc/Form__Username_And_Password'

import { get__user, patch__user } from '../api/user'
import { RegexContext } from '../context/Provider__Regex'





export default function Profile() {
	
	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { setError } = useContext(ErrorContext)

	const [ Name, setName ] = useState('')
	const [ Password, setPassword ] = useState('')
	const { NAME_REGEX, PASSWORD_REGEX } = useContext(RegexContext)

	const [ loading_delete_account, setLoading_delete_account ] = useState(false)



	// __________________________________________________ User __________________________________________________

	const { data: user, isLoading: isLoading__user, error: error__user } = useQuery({
		queryFn: () => get__user(axiosPrivate), 
		queryKey: [ 'user' ], 
	})

	if(error__user) {
		handle_error({
			err: error__user, 
		})
	}

	const mutate__user = useMutation({
		mutationFn: json => patch__user(axiosPrivate, json), 
		onSuccess: () => {
			navigate(-1)
		}, 
		onError: err => {
			handle_error({
				err,
				handle_409: () => setError('Name bereits vergeben!')
			})
		}
	})





	const handleSubmit = event => {

		event.preventDefault()
		setError('')

		if((Name && !NAME_REGEX.test(Name)) || (Password && !PASSWORD_REGEX.test(Password)) || (!Name && !Password)) return


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

		mutate__user.mutate(json)

	}

	const delete_account = () => {

		if(!window.confirm('Sicher, dass du deinen Account löschen willst?\nDas kann man nicht rückgängig machen!')) return
		if(!window.confirm('Wirklich, ganz sicher?')) return

		setLoading_delete_account(true)

		axiosPrivate.delete('/user').then(() => {

			query_client.clear()
			navigate('/registration_and_login', { replace: true })

		}).catch(err => {

			handle_error({
				err, 
			})

		}).finally(() => setLoading_delete_account(false))
	}





	return <>
	
		<PopupOptions user={user}/>
	
	



		<div className='profile'>

			<Previous onClick={() => navigate(-1, { replace: true })}>
				<h1>Anmeldedaten ändern</h1>
			</Previous>

			{/* ____________________ Loading animation ____________________ */}
			{isLoading__user && <div className='profile_loader'><LoaderDots/></div>}


			
			{!isLoading__user && <>

				<form onSubmit={handleSubmit}>

					{mutate__user.isSuccess && <h2>Erfolgreich gespeichert!</h2>}

					<RegistrationForm 
						Name={Name} 
						setName={setName} 

						Password={Password} 
						setPassword={setPassword} 
						
						isRequired={false}
					/>

					<CustomButton
						text='Ändern'
						loading={mutate__user.isPending}
					/>

				</form>



				<CustomButton
					text='Account löschen'
					onClick={delete_account}
					className='button_reverse_red'
					loading={loading_delete_account}
				/>

			</>}

		</div>
		
	</>
}
