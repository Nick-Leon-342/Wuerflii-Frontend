

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import type { Type__Client_To_Server__User__PATCH } from '../types/Type__Client_To_Server/Type__Client_To_Server__User__PATCH'
import Context__Universal_Loader from '../Provider_And_Context/Provider_And_Context__Universal_Loader'
import Context__Error from '../Provider_And_Context/Provider_And_Context__Error'
import Context__Regex from '../Provider_And_Context/Provider_And_Context__Regex'
import useErrorHandling from '../hooks/useErrorHandling'
import { get__user, patch__user } from '../api/user'
import { api } from '@/api/axios'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Form__Username_And_Password from '../components/Username_And_Password/Username_And_Password__Form'
import Popup__Settings from '../components/Popup/Popup__Settings'
import Custom_Button from '../components/misc/Custom_Button'
import Previous from '../components/misc/Previous'
import { Button } from '@/components/ui/button'
import { ChartNoAxesColumn, LogOut, UserPen, UserX } from 'lucide-react'





export default function Profile() {

	const navigate		= useNavigate()
	const { t }			= useTranslation()
	const query_client	= useQueryClient()
	const handle_error	= useErrorHandling()

	const { setError } = useContext(Context__Error)
	const { setLoading__universal_loader } = useContext(Context__Universal_Loader)

	const [ name, 					setName						] = useState<string>('')
	const [ password, 				setPassword					] = useState<string>('')
	const [ password__confirm,		setPassword__confirm		] = useState<string>('')
	const { NAME__REGEX,			PASSWORD__REGEX				} = useContext(Context__Regex)

	const [ loading_delete_account, setLoading_delete_account	] = useState<boolean>(false)



	// __________________________________________________ User __________________________________________________

	const { data: user, isLoading: isLoading__user, error: error__user } = useQuery({
		queryFn: () => get__user(), 
		queryKey: [ 'user' ], 
	})

	if(error__user) {
		handle_error({
			err: error__user, 
		})
	}

	const mutate__user = useMutation({
		mutationFn: (json: Type__Client_To_Server__User__PATCH) => patch__user(json), 
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





	function change_credentials(): void {

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

		api.delete('/user').then(() => {

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

		api.delete('/auth/logout').then(() => {
			
			query_client.clear()
			navigate('/registration_and_login', { replace: true })
				
		}).catch(err => {

			handle_error({
				err
			})
			
		}).finally(() => setLoading_logout(false))

	}





	return <>
	
		<Popup__Settings user={user}/>
	
	



		<div className='flex flex-col w-9/10 gap-4 md:w-150 [&_button]:not-first:justify-start'>

			<Previous onClick={() => navigate(-1)}/>


			
			{/* ____________________ Statistics ____________________ */}
			<Button 
				onClick={() => navigate('/analytics', { replace: false })}
				variant='outline'
			>
				<ChartNoAxesColumn/>
				{t('statistics')}
			</Button>



			{/* ____________________ Change Credentials ____________________ */}
			<Dialog>
				<DialogTrigger asChild>
					<Button variant='outline'>
						<UserPen/>
						{t('change_credentials')}
					</Button>
				</DialogTrigger>



				<DialogContent showCloseButton={false}>
					<DialogHeader>
						<DialogTitle>{t('change_credentials')}</DialogTitle>
					</DialogHeader>

					<Form__Username_And_Password 
						name={name} 
						setName={setName} 

						password={password} 
						setPassword={setPassword} 

						password_confirm={password__confirm} 
						setPassword_confirm={setPassword__confirm} 
						
						isRequired={false}
					/>

					<DialogFooter>
						<Custom_Button
							className='profile--change_credentials'
							loading={mutate__user.isPending}
							onClick={change_credentials}
							text={t('change')}
						/>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			


			{/* ____________________ Danger Zone ____________________ */}
			<>
			
				<hr/>

				<h1 className='text-xl'>{t('danger_zone')}</h1>
			
				<Custom_Button
					SVG={<LogOut/>}
					onClick={logout}
					text={t('logout')}
					variant='destructive'
					loading={loading_logout}
				/>

				<Custom_Button
					SVG={<UserX/>}
					variant='destructive'
					onClick={delete_account}
					text={t('delete_account')}
					loading={loading_delete_account}
				/>
			</>

		</div>
	</>
}
