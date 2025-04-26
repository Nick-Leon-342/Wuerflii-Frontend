

import './scss/Popup_Options.scss'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from './Popup'
import LoaderBox from '../Loader/Loader_Box'
import CustomButton from '../others/Custom_Button'

import { ReactComponent as Settings } from '../../svg/Settings.svg'





/**
 * 
 * Popup_Options component that displays various user settings options, such as dark mode toggle,
 * profile navigation, statistics navigation, and logout functionality.
 *
 * @component
 * @example
 * // Example usage of Popup_Options component
 * <Popup_Options setUser={setUser} user={user} />
 *
 * @param {Object} props - The component props
 * @param {Function} props.setUser - Function to update the user state
 * @param {Object} props.user - The current user object containing user information like DarkMode
 *
 * @returns {JSX.Element} The rendered Popup_Options component
 * 
 */

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

	const darkMode_string = 'Kniffel_DarkMode'





	useEffect(() => {

		if(localStorage.getItem(darkMode_string) === 'true') document.body.classList.add('dark')

	}, [])

	useEffect(() => {
		
		if(!user) return
		
		if(user.DarkMode) {
			document.body.classList.add('dark')
			localStorage.setItem(darkMode_string, 'true')
		} else {
			document.body.classList.remove('dark')
			localStorage.setItem(darkMode_string, 'false')
		}

	}, [ user ])

	const change_dark_mode = async () => {

		if(!user) return

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
			className='button button_reverse button_scale_3 popup_options-icon'
		><Settings/></button>
	




		<Popup
			showPopup={show_options}
			setShowPopup={setShow_options}
			title='Einstellungen'
		>
			<div className='popup_options'>

				<div className='box'>

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
							className='button button_reverse_green button_scale_3'
							onClick={() => navigate('/profile', { replace: false })}
						>Profil</button>
					</section>

					<section>
						<button 
							className='button button_reverse_green button_scale_3'
							onClick={() => navigate('/analytics', { replace: false })}
						>Statistiken</button>
					</section>


					<section>
						<CustomButton
							text='Ausloggen'
							onClick={logout}
							loading={loading_logout}
							className='button_reverse_red'
						/>
					</section>

				</div>
				
			</div>
		</Popup>
	</>
}
