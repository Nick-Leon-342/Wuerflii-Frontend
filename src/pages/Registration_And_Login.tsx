

import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import { useState } from 'react'

import { post__login, post__registration } from '@/api/auth'
import useErrorHandling from '@/hooks/useErrorHandling'
import { Zod__User_POST } from '@/types/Zod__User'

import Username_And_Password__Form from '@/components/Username_And_Password/Username_And_Password__Form'
import Username_And_Password__Input from '@/components/Username_And_Password/Username_And_Password__Input'
import Popup__Settings from '@/components/misc/Popup__Settings'
import Custom_Button from '@/components/misc/Custom_Button'
import { Button } from '@/components/ui/button'
import Wuerflii from '@/svg/wuerflii.svg?react'
import { FileUser, LogIn } from 'lucide-react'
import { toast } from 'sonner'





export default function Registration_And_Login() {

	const location		= useLocation()
    const navigate		= useNavigate()
	const { t }			= useTranslation()
	const handle_error	= useErrorHandling()
	
    const [ name, 				setName				] = useState<string>('')
    const [ password, 			setPassword			] = useState<string>('')
    const [ password_confirm,	setPassword_confirm	] = useState<string>('')
	
	const next = new URLSearchParams(location.search).get('next') || ''
	const [ loading, 			setLoading			] = useState(false)
	const [ show_login, 		setShow_login		] = useState(true)





	function switch_between_registration_and_login() {

		setShow_login(prev => !prev)
		setName('')
		setPassword('')

	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {

		event.preventDefault()
		if(show_login) {
			login()
		} else {
			registration()
		}

    }

	const registration = () => {
		
		// Check if name and password are valid
		const zod_result = Zod__User_POST.safeParse({ Name: name, Password: password })
		if(!zod_result.success) return toast.error(t('please_fill_out_registration'))
		const json_user = zod_result.data
		
		// Check if passwords match
		if(password !== password_confirm) return toast.error(t('error.password_confirm_doesnt_match'))

		setLoading(true)


		post__registration(json_user).then(() => {

			setName('')
			setPassword('')

			navigate('/session', { replace: true })

		}).catch((err: AxiosError) => {

			handle_error({
				err, 
				handle_409: () => {
					if(err.response?.data === 'Username already taken.') {
						toast.error(t('error.username_taken'))
					} else if(err.response?.data === 'User registration is disabled.') {
						toast.error(t('registration_disabled'))
					}
				}
			})

		}).finally(() => setLoading(false))

	}

	const login = () => {
		
		// Check if name and password are valid
		const zod_result = Zod__User_POST.safeParse({ Name: name, Password: password })
		if(!zod_result.success) return toast.error(t('please_fill_out_registration'))
		const json_user = zod_result.data

		setLoading(true)


		post__login(json_user).then(() => {

			setName('')
			setPassword('')

			navigate(next || '/', { replace: true })

		}).catch((err: AxiosError) => {

			handle_error({
				err, 
				handle_409: () => {
					toast.error(t('wrong_username_or_password'))
				}
			})

		}).finally(() => setLoading(false))

	}





    return <>

		<Popup__Settings 
			user={null}
		/>

		<div className='registration_and_login flex flex-row items-center justify-center h-dvh w-9/10!'>
			<div className='flex flex-col lg:flex-row items-center gap-15 lg:gap-10 w-full md:w-fit'>

				<div className='flex flex-row items-center gap-3'>
					<Wuerflii className='[&_path]:fill-muted-foreground w-17 h-17'/>
					<h1 className='text-muted-foreground text-4xl font-bold'>Wuerflii</h1>
				</div>


				<hr className='bg-border w-full lg:w-px h-px lg:h-70'/>


				<div className='flex flex-col gap-2 w-full md:w-lg'>

					<form 
						onSubmit={handleSubmit}
						className='flex flex-col gap-6'
					>

						{show_login && <>

							<Username_And_Password__Input
								placeholder='username'
								setValue={setName}
								value={name}
								type='text'
							/>

							<Username_And_Password__Input
								placeholder='password'
								setValue={setPassword}
								value={password}
								type='password'
							/>

						</>}



						{!show_login && <>

							<Username_And_Password__Form 
								name={name} 
								setName={setName} 
								
								password={password} 
								setPassword={setPassword} 
		
								password_confirm={password_confirm}
								setPassword_confirm={setPassword_confirm}

								isRequired={true}
							/>

						</>}



						<Custom_Button 
							text={show_login ? t('login') : t('register')}
							SVG={show_login ? <LogIn/> : <FileUser/>}
							className='justify-baseline'
							loading={loading}
						/>

					</form>



					<div className='flex flex-row items-center justify-end gap-2'>
						<span className='text-sm'>{show_login ? t('no_account_yet') : t('already_have_an_account')}</span>
						<Button
							variant='link'
							className='text-secondary p-0'
							onClick={switch_between_registration_and_login}
						>{show_login ? t('register') : t('login')}</Button>
					</div>
					
				</div>

			</div>
		</div>
	</>
}
