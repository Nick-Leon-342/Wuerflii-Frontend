

import './scss/Popup_Options.scss'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from './Popup'
import LoaderBox from '../Loader/Loader_Box'
import CustomButton from '../others/Custom_Button'





export default function Popup_Options({
	setUser, 
	user, 
}) {

    const { setAuth } = useAuth()

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ show_options, setShow_options ] = useState(false)
	
	const [ loading_darkMode, setLoading_darkMode ] = useState(false)





	useEffect(() => {
		
		if(!user) return
		
		if(user.DarkMode) {
			document.body.classList.add('dark')
		} else {
			document.body.classList.remove('dark')
		}

	}, [ user ])

	const change_dark_mode = async () => {

		setLoading_darkMode(true)

		axiosPrivate.patch('/user', { DarkMode: !user.DarkMode }).then(() => {

			setUser(prev => {
				const tmp = { ...prev }
				tmp.DarkMode = !tmp.DarkMode
				return tmp
			})

		}).catch(err => {

			handle_error({
				err, 
				handle_404: () => {
					alert('Benutzer nicht gefunden.')
					navigate('/', { replace: true })
				}
			})

		}).finally(() => setLoading_darkMode(false))

	}





	// __________________________________________________ Logout __________________________________________________

	const [ loading_logout, setLoading_logout ] = useState(false)

	const logout = () => {

		setLoading_logout(true)

		axiosPrivate.delete('/logout').then(() => {
			
			setAuth({ accessToken: '' })
			navigate('/login', { replace: true })
				
		}).catch(err => {

			handle_error({
				err
			})
			
		}).finally(() => setLoading_logout(false))

	}





	return <>

		<button
			onClick={() => setShow_options(true)} 
			className='button button-reverse button-responsive popup_options-icon'
		><svg viewBox='0 -960 960 960'><path d='m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z'/></svg></button>
	




		<Popup
			showPopup={show_options}
			setShowPopup={setShow_options}
			title='Einstellungen'
		>
			<div className='popup_options'>

				<div className='container'>

					<section className='darkmode'>
						
						{loading_darkMode && <>
							<div className='popup_options_loading_darkmode-container'>
								<LoaderBox className='popup_options_loading_darkmode' dark={true}/>
							</div>
						</>}
						
						{!loading_darkMode &&
							<input
								type='checkbox'
								checked={user?.DarkMode}
								onChange={change_dark_mode}
							/>
						}

						<label>Dark mode</label>
						
					</section>

					<section>
						<button 
							className='button button-reverse'
							onClick={() => navigate('/profile', { replace: false })}
						>Profil</button>
					</section>

					<section>
						<button 
							className='button button-reverse'
							onClick={() => navigate('/analytics', { replace: false })}
						>Statistiken</button>
					</section>


					<section>
						<CustomButton
							text='Ausloggen'
							onClick={logout}
							loading={loading_logout}
							className='button-red-reverse'
						/>
					</section>

				</div>
				
			</div>
		</Popup>
	</>
}
