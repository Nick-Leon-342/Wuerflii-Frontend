

import './scss/Profile.scss'

import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useErrorHandling from '../hooks/useErrorHandling'

import LoaderDots from '../components/Loader/Loader_Dots'
import CustomButton from '../components/misc/Custom_Button'
import Popup__Options from '../components/Popup/Popup__Options'
import Previous from '../components/NavigationElements/Previous'
import Form__Username_And_Password from '../components/misc/Form__Username_And_Password'

import { get__user, patch__user } from '../api/user'

import Context__Error from '../Provider_And_Context/Provider_And_Context__Error'
import Context__Regex from '../Provider_And_Context/Provider_And_Context__Regex'

import type { Type__Client_To_Server__User__PATCH } from '../types/Type__Client_To_Server/Type__Client_To_Server__User__PATCH'





export default function Profile() {
	
	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { setError } = useContext(Context__Error)

	const [ name, 					setName						] = useState<string>('')
	const [ password, 				setPassword					] = useState<string>('')
	const [ password__confirm,		setPassword__confirm		] = useState<string>('')
	const { NAME_REGEX,				PASSWORD_REGEX				} = useContext(Context__Regex)

	const [ loading_delete_account, setLoading_delete_account	] = useState<boolean>(false)



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
		mutationFn: (json: Type__Client_To_Server__User__PATCH) => patch__user(axiosPrivate, json), 
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





	function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {

		event.preventDefault()
		setError('')

		if((name && !NAME_REGEX.test(name)) || (password && !PASSWORD_REGEX.test(password)) || (!name && !password)) return
		if(password !== password__confirm) return setError('Passwörter stimmen nicht überein.')


		const json: Type__Client_To_Server__User__PATCH = {}
		if(NAME_REGEX.test(name) && PASSWORD_REGEX.test(password)) {
			// Name and Password are valid
			json.Name = name
			json.Password = password
		} else if(NAME_REGEX.test(name)) {
			// Name is valid, password not entered
			json.Name = name
		} else {
			// Password is valid, name not entered
			json.Password = password
		}

		mutate__user.mutate(json)

	}

	function delete_account() {

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
	
		<Popup__Options user={user}/>
	
	



		<div className='profile'>

			<Previous onClick={() => navigate(-1)}>
				<h1>Anmeldedaten ändern</h1>
			</Previous>

			{/* ____________________ Loading animation ____________________ */}
			{isLoading__user && <div className='profile_loader'><LoaderDots/></div>}


			
			{!isLoading__user && <>

				<form onSubmit={handleSubmit}>

					{mutate__user.isSuccess && <h2>Erfolgreich gespeichert!</h2>}

					<Form__Username_And_Password 
						name={name} 
						setName={setName} 

						password={password} 
						setPassword={setPassword} 

						password_confirm={password__confirm} 
						setPassword_confirm={setPassword__confirm} 
						
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
