

import './scss/Profile.scss'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import useErrorHandling from '../hooks/useErrorHandling'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'

import Form__Username_And_Password from '../components/misc/Form__Username_And_Password'
import Previous from '../components/NavigationElements/Previous'
import Popup__Options from '../components/Popup/Popup__Options'
import CustomButton from '../components/misc/Custom_Button'

import { get__user, patch__user } from '../api/user'

import Context__Error from '../Provider_And_Context/Provider_And_Context__Error'
import Context__Regex from '../Provider_And_Context/Provider_And_Context__Regex'

import Context__Universal_Loader from '../Provider_And_Context/Provider_And_Context__Universal_Loader'

import type { Type__Client_To_Server__User__PATCH } from '../types/Type__Client_To_Server/Type__Client_To_Server__User__PATCH'





export default function Profile() {

    const { setAuth } = useAuth()
	const navigate = useNavigate()
	const { t } = useTranslation()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { setError } = useContext(Context__Error)
	const { setLoading__universal_loader } = useContext(Context__Universal_Loader)

	const [ name, 					setName						] = useState<string>('')
	const [ password, 				setPassword					] = useState<string>('')
	const [ password__confirm,		setPassword__confirm		] = useState<string>('')
	const { NAME__REGEX,			PASSWORD__REGEX				} = useContext(Context__Regex)

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
				handle_409: () => setError(t('error.username_taken'))
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
		if(password !== password__confirm) return setError(t('error.password_confirm_doesnt_match'))


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

		if(!window.confirm(t('confirm_user_deletion'))) return
		if(!window.confirm(t('confirm_user_deletion_confirm'))) return

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

		axiosPrivate.delete('/auth/logout').then(() => {
			
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
			>{t('statistics')}</Link>


			{/* __________________________________________________ Change credentials __________________________________________________ */}
			<form onSubmit={handleSubmit}>

				<hr/>

				<h1>{t('change_credentials')}</h1>

				{mutate__user.isSuccess && <h2>{t('successfully_saved')}</h2>}

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
					className='profile--change_credentials'
					loading={mutate__user.isPending}
					text={t('change')}
				/>

			</form>



			{/* __________________________________________________ Danger Zone __________________________________________________ */}
			<>
			
				<hr/>

				<h1>{t('danger_zone')}</h1>
			
				<CustomButton
					onClick={logout}
					text={t('logout')}
					loading={loading_logout}
					className='button_reverse_red'
				/>

				<CustomButton
					onClick={delete_account}
					text={t('delete_account')}
					className='button_reverse_red'
					loading={loading_delete_account}
				/>
			</>

		</div>
	</>
}
