

import './scss/Profile.scss'

import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useErrorHandling from '../hooks/useErrorHandling'

import CustomButton from '../components/misc/Custom_Button'
import Popup__Options from '../components/Popup/Popup__Options'
import Previous from '../components/NavigationElements/Previous'
import Form__Username_And_Password from '../components/misc/Form__Username_And_Password'

import { get__user, patch__user } from '../api/user'

import Context__Error from '../Provider_And_Context/Provider_And_Context__Error'
import Context__Regex from '../Provider_And_Context/Provider_And_Context__Regex'

import type { Type__Client_To_Server__User__PATCH } from '../types/Type__Client_To_Server/Type__Client_To_Server__User__PATCH'
import Context__Universal_Loader from '../Provider_And_Context/Provider_And_Context__Universal_Loader'





export default function Profile() {

    const { setAuth } = useAuth()
	
	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { setError } = useContext(Context__Error)
	const { setLoading__universal_loader } = useContext(Context__Universal_Loader)

	const [ name, 					setName						] = useState<string>('')
	const [ password, 				setPassword					] = useState<string>('')
	const [ password__confirm,		setPassword__confirm		] = useState<string>('')
	const { NAME__REGEX,				PASSWORD__REGEX				} = useContext(Context__Regex)

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

	useEffect(() => {
		setLoading__universal_loader(isLoading__user)
	}, [ isLoading__user, setLoading__universal_loader ])





	function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {

		event.preventDefault()
		setError('')

		if((name && !NAME__REGEX.test(name)) || (password && !PASSWORD__REGEX.test(password)) || (!name && !password)) return
		if(password !== password__confirm) return setError('Passwörter stimmen nicht überein.')


		const json: Type__Client_To_Server__User__PATCH = {}
		if(NAME__REGEX.test(name) && PASSWORD__REGEX.test(password)) {
			// Name and Password are valid
			json.Name = name
			json.Password = password
		} else if(NAME__REGEX.test(name)) {
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





	// __________________________________________________ Logout __________________________________________________

	const [ loading_logout, setLoading_logout ] = useState(false)

	const logout = () => {

		setLoading_logout(true)

		axiosPrivate.delete('/logout').then(() => {
			
			query_client.clear()
			setAuth({ 
				user: 			null, 
				access_token: 	'', 
			})
			navigate('/registration_and_login', { replace: true })
				
		}).catch(err => {

			handle_error({
				err
			})
			
		}).finally(() => setLoading_logout(false))

	}





	return <>
	
		<Popup__Options user={user}/>
	
	



		<div className='profile'>

			<Previous onClick={() => navigate(-1)}/>


			
			<Link 
				to='/analytics'
				className='button button_scale_2 profile--analytics'
			>Statistiken</Link>


			{/* __________________________________________________ Change credentials __________________________________________________ */}
			<form onSubmit={handleSubmit}>

				<hr/>

				<h1>Anmeldedaten ändern</h1>

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
					className='profile--change_credentials'
					loading={mutate__user.isPending}
				/>

			</form>



			{/* __________________________________________________ Danger Zone __________________________________________________ */}
			<>
			
				<hr/>

				<h1>Danger Zone</h1>
			
				<CustomButton
					text='Ausloggen'
					onClick={logout}
					loading={loading_logout}
					className='button_reverse_red'
				/>

				<CustomButton
					text='Account löschen'
					onClick={delete_account}
					className='button_reverse_red'
					loading={loading_delete_account}
				/>
			</>

		</div>
	</>
}
