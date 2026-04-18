

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import { type Type__User, Zod__User_PATCH, type Type__User_PATCH } from '@/types/Zod__User'
import { delete__user, get__user, patch__user } from '@/api/user'
import useErrorHandling from '@/hooks/useErrorHandling'
import { delete__logout } from '@/api/auth'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Username_And_Password__Form from '@/components/Username_And_Password/Username_And_Password__Form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartNoAxesColumn, Edit, LogOut, UserX } from 'lucide-react'
import Popup__Settings from '@/components/misc/Popup__Settings'
import Custom_Button from '@/components/misc/Custom_Button'
import Previous from '@/components/misc/Previous'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'





export default function Profile() {

	const navigate		= useNavigate()
	const { t }			= useTranslation()
	const query_client	= useQueryClient()
	const handle_error	= useErrorHandling()

	const [ name, 					setName						] = useState<string>('******')
	const [ password, 				setPassword					] = useState<string>('')
	const [ password__confirm,		setPassword__confirm		] = useState<string>('')

	const [ successfully_saved, 	setSuccessfully_saved		] = useState<boolean>(false)
	const [ loading_logout, 		setLoading_logout			] = useState<boolean>(false)
	const [ loading_delete_account, setLoading_delete_account	] = useState<boolean>(false)





	// __________________________________________________ User __________________________________________________

	const [ user, setUser ] = useState<Type__User>()

	const { data: tmp_user, error: error__user } = useQuery({
		queryFn: () => get__user(), 
		queryKey: [ 'user' ], 
	})

	if(error__user) {
		handle_error({
			err: error__user, 
		})
	}

	useEffect(() => {
		function init() { 
			if(!tmp_user) return
			setName(tmp_user.Name || '') 
			setUser(tmp_user)
		}
		init()
	}, [ tmp_user ])

	const mutate__user = useMutation({
		mutationFn: (json: Type__User_PATCH) => patch__user(json), 
		onSuccess: (_, json) => {
			if(!user) return
			setUser(prev => {
				if(!prev || !json.Name) return prev
				const tmp = { ...prev }
				if(json.Name) tmp.Name = json.Name
				return tmp
			})
			toast.success(t('successfully.saved'))
			setSuccessfully_saved(true)
		}, 
		onError: err => {
			handle_error({
				err,
				handle_409: () => toast.error(t('error.username_taken'))
			})
		}
	})

	useEffect(() => {
		function reset() { setSuccessfully_saved(false) }
		reset()
	}, [ name, password, password__confirm ])





	function change_credentials(json: Type__User_PATCH) {

		// Check if name and/or password are valid
		const zod_result = Zod__User_PATCH.safeParse(json)
		if(!zod_result.success) return toast.error(t('please_fill_out_registration'))
		const json_user = zod_result.data

		// Return if nothing changed
		if(!json_user.Name && !json_user.Password) return

		// Check if passwords match
		if(password !== password__confirm) return toast.error(t('error.password_confirm_doesnt_match'))

		// Send user to backend
		mutate__user.mutate(json_user)

	}

	function delete_account() {

		if(!window.confirm(t('confirm_user_deletion'))) return
		if(!window.confirm(t('confirm_user_deletion_confirm'))) return

		setLoading_delete_account(true)

		delete__user().then(() => {

			query_client.clear()
			navigate('/registration_and_login', { replace: true })

		}).catch(err => {

			handle_error({
				err, 
			})

		}).finally(() => setLoading_delete_account(false))
	}

	function logout() {

		setLoading_logout(true)

		delete__logout().then(() => {
			
			navigate('/registration_and_login', { replace: true })
			setTimeout(() => query_client.clear(), 0)
			toast.success(t('successfully.logged_out'))
				
		}).catch(err => {

			handle_error({
				err
			})
			
		}).finally(() => { setLoading_logout(false) })

	}





	return <>
	
		<Popup__Settings user={user}/>
	
	



		<div className='flex flex-col w-9/10 gap-4 md:w-150 [&_button]:not-first:justify-start'>

			<Previous onClick={() => navigate(-1)}/>



			{/* ____________________ Change credentials ____________________ */}

			<Card className='bg-background'>
				<CardHeader>
					<CardTitle>{t('account')}</CardTitle>
				</CardHeader>

				<CardContent>

					{/* __________ Username __________ */}
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant='ghost'
								className='justify-between! w-full items-center'
							>
								<span>{t('username')}</span>
								<div className='flex flex-row items-center gap-2'>
									<span>{user?.Name}</span>
									<Edit/>
								</div>
							</Button>
						</DialogTrigger>

						<DialogContent showCloseButton={false}>
							<DialogHeader>
								<DialogTitle>{t('username')}</DialogTitle>
							</DialogHeader>

							<Username_And_Password__Form
								isRequired={false}
								name={name}
								setName={setName}
							/>

							<DialogFooter>
								<Custom_Button
									onClick={() => change_credentials({ Name: name })}
									loading={mutate__user.isPending}
									ok={successfully_saved}
									text={t('edit')}
								/>
							</DialogFooter>
						</DialogContent>
					</Dialog>



					{/* __________ Password __________ */}
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant='ghost'
								className='justify-between! w-full items-center'
							>
								<span>{t('password')}</span>
								<div className='flex flex-row items-center gap-2'>
									<span>******</span>
									<Edit/>
								</div>
							</Button>
						</DialogTrigger>

						<DialogContent showCloseButton={false}>
							<DialogHeader>
								<DialogTitle>{t('password')}</DialogTitle>
							</DialogHeader>

							<Username_And_Password__Form
								isRequired={false}
								password={password}
								setPassword={setPassword}
								password_confirm={password__confirm}
								setPassword_confirm={setPassword__confirm}
							/>

							<DialogFooter>
								<Custom_Button
									onClick={() => change_credentials({ Password: password })}
									loading={mutate__user.isPending}
									ok={successfully_saved}
									text={t('edit')}
								/>
							</DialogFooter>
						</DialogContent>
					</Dialog>

				</CardContent>
			</Card>


			
			{/* ____________________ Statistics ____________________ */}

			<Button 
				onClick={() => navigate('/analytics', { replace: false })}
				variant='outline'
			>
				<ChartNoAxesColumn/>
				{t('statistics')}
			</Button>
			


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
