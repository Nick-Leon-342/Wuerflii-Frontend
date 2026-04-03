

import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'

import useErrorHandling from '@/hooks/useErrorHandling'
import { api } from '@/api/axios'

import Context__Universal_Loader from '@/Provider_And_Context/Provider_And_Context__Universal_Loader'
import Context__Error from '@/Provider_And_Context/Provider_And_Context__Error'
import Context__Regex from '@/Provider_And_Context/Provider_And_Context__Regex'

import Username_And_Password__Form from '@/components/Username_And_Password/Username_And_Password__Form'
import Username_And_Password__Input from '@/components/Username_And_Password/Username_And_Password__Input'
import Popup__Settings from '@/components/Popup/Popup__Settings'
import Custom_Button from '@/components/misc/Custom_Button'
import { Button } from '@/components/ui/button'
import Wuerflii from '@/svg/wuerflii.svg?react'
import { FileUser, LogIn } from 'lucide-react'





export default function Registration_And_Login() {

	const location = useLocation()
    const navigate = useNavigate()
	const { t } = useTranslation()
	const [ next, setNext ] = useState('')
	const handle_error = useErrorHandling()

	const { setError } = useContext(Context__Error)
	const { NAME__REGEX, PASSWORD__REGEX } = useContext(Context__Regex)
	const { setLoading__universal_loader } = useContext(Context__Universal_Loader)

    const [ name, 				setName				] = useState<string>('')
    const [ password, 			setPassword			] = useState<string>('')
    const [ password_confirm,	setPassword_confirm	] = useState<string>('')
	
	const [ loading, 			setLoading			] = useState(false)

	const [ show_login, 		setShow_login		] = useState(true)






	useEffect(() => {
		function reset_ui() {
			setError('')
			setName('')
			setPassword('')
		}
		reset_ui()
	}, [ show_login ]) // eslint-disable-line

	useEffect(() => {
		function start() {
			setLoading__universal_loader(false)
			setNext(new URLSearchParams(location.search).get('next') || '')
		}
		start()
	}, []) // eslint-disable-line

	useEffect(() => setError(''), [ name, password, setError ])





	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {

		event.preventDefault()
		if(show_login) {
			login()
		} else {
			registration()
		}

    }

	const registration = () => {
		
		if(!name || !NAME__REGEX.test(name) || !password || !PASSWORD__REGEX.test(password)) return setError(t('please_fill_out_registration'))
		if(password !== password_confirm) return setError(t('error.password_confirm_doesnt_match'))
		setLoading(true)
		setError('')


		api.post('/auth/registration', 
			{ 
				Name: name, 
				Password: password, 
			}, {
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		).then(() => {

			setName('')
			setPassword('')

			navigate('/session', { replace: true })

		}).catch((err: AxiosError) => {

			handle_error({
				err, 
				handle_409: () => {
					if(err.response?.data === 'Username already taken.') {
						setError(t('error.username_taken'))
					} else if(err.response?.data === 'User registration is disabled.') {
						setError(t('registration_disabled'))
					}
				}
			})

		}).finally(() => setLoading(false))

	}

	const login = () => {

		setLoading(true)
		setError('')


		api.post('/auth/login', 
			{ 
				Name: name, 
				Password: password, 
			}, {
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		).then(() => {

			setName('')
			setPassword('')

			navigate(next || '/', { replace: true })

		}).catch((err: AxiosError) => {

			handle_error({
				err, 
				handle_409: () => {
					setError(t('wrong_username_or_password'))
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
							onClick={() => setShow_login(prev => !prev)}
						>{show_login ? t('register') : t('login')}</Button>
					</div>
					
				</div>

			</div>
		</div>
	</>
}
