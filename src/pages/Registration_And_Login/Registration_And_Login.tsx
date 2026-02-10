

import './scss/Registration_And_Login.scss'

import packageJson from '../../../package.json'
import { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import { axiosDefault } from '../../api/axios'
import useErrorHandling from '../../hooks/useErrorHandling'

import Custom_Button from '../../components/misc/Custom_Button'
import Input_With_SVG from '../../components/misc/Input_With_SVG'
import Custom_Link from '../../components/NavigationElements/Custom_Link'
import Form__Username_And_Password from '../../components/misc/Form__Username_And_Password'

import Key from '../../svg/Key.svg?react'
import Icon from '../../svg/default.svg?react'
import Person from '../../svg/Person.svg?react'

import Context__Regex from '../../Provider_And_Context/Provider_And_Context__Regex'
import Context__Error from '../../Provider_And_Context/Provider_And_Context__Error'
import Context__Universal_Loader from '../../Provider_And_Context/Provider_And_Context__Universal_Loader'

import type { AxiosError } from 'axios'

import { useTranslation } from 'react-i18next'
import Popup__Options from '../../components/Popup/Popup__Options'





export default function Registration_And_Login() {

	
	const { setAuth } = useAuth()
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
		if(password !== password_confirm) return setError(t('password_confirm_doesnt_match'))
		setLoading(true)
		setError('')


		axiosDefault.post('/auth/registration', 
			{ 
				Name: name, 
				Password: password, 
			}, {
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		).then(({ data }) => {


			setAuth({ 
				user: null, 
				access_token: data.access_token 
			})
			setName('')
			setPassword('')

			navigate('/session', { replace: true })


		}).catch((err: AxiosError) => {

			handle_error({
				err, 
				handle_409: () => {
					console.log(err)
					if(err.response?.data === 'Username already taken.') {
						setError(t('username_taken'))
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


		axiosDefault.post('/auth/login', 
			{ 
				Name: name, 
				Password: password, 
			}, {
				headers: { 'Content-Type': 'application/json' },
				withCredentials: true
			}
		).then(({ data }) => {


			setAuth({ 
				user: null, 
				access_token: data.access_token 
			})
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

		<Popup__Options 
			user={null}
		/>

		<div className='registration_and_login'>

			<div className='registration_and_login--logo_container'>

				<div className='registration_and_login--logo'>
					<Icon/>
					<h1>Wuerflii</h1>
				</div>
				<div className='registration_and_login--version'>
					<span>v_{packageJson.version}</span>
				</div>

			</div>


			<div className='registration_and_login--line'/>


			<div className='registration_and_login--page'>

				<form onSubmit={handleSubmit}>

					{show_login && <>

						<Input_With_SVG
							type='text'
							value={name}
							SVG={<Person/>}
							isRequired={true}
							name={t('username')}
							onValueChange={({ target }) => setName(target.value)}
						/>

						<Input_With_SVG
							SVG={<Key/>}
							type='password'
							value={password}
							isRequired={true}
							name={t('password')}
							onValueChange={({ target }) => setPassword(target.value)}
						/>

					</>}



					{!show_login && <>

						<Form__Username_And_Password 
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
						loading={loading}
					/>

				</form>



				<Custom_Link 
					onClick={() => setShow_login(prev => !prev)}
					text={show_login ? t('register') : t('login')}
					textBefore={show_login ? t('no_account_yet') : t('already_have_an_account')}
				/>
				
			</div>

		</div>
	</>
}
