

import './scss/Popup_Options.scss'

import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import useAuth from '../../hooks/useAuth'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import { ServerVersionContext } from '../../context/Server_Version'

import Popup from './Popup'
import LoaderBox from '../Loader/Loader_Box'
import CustomButton from '../misc/Custom_Button'

import { ReactComponent as Settings } from '../../svg/Settings.svg'

import { patch__user } from '../../api/user'





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
 * @param {Object} props.user - The current user object containing user information like DarkMode
 *
 * @returns {JSX.Element} The rendered Popup_Options component
 * 
 */

export default function Popup_Options({
	user, 
}) {

    const { setAuth } = useAuth()

	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { server_version } = useContext(ServerVersionContext)

	const [ show_options, setShow_options ] = useState(false)

	const darkMode_string = 'Wuerflii_DarkMode'

	const [ darkmode, setDarkmode ] = useState(false)
	const change_dark_mode = useMutation({
		mutationFn: () => patch__user(axiosPrivate, { DarkMode: !darkmode }), 
		onSuccess: () => {
			query_client.setQueryData([ 'user' ], { ...user, DarkMode: !darkmode })
		}
	})





	useEffect(() => {

		if(localStorage.getItem(darkMode_string) === 'true') document.body.classList.add('dark')

	}, [])

	useEffect(() => {
		
		if(!user) return
		setDarkmode(user.DarkMode)
		
		if(user.DarkMode) {
			document.body.classList.add('dark')
			localStorage.setItem(darkMode_string, 'true')
		} else {
			document.body.classList.remove('dark')
			localStorage.setItem(darkMode_string, 'false')
		}

	}, [ user ])





	// __________________________________________________ Logout __________________________________________________

	const [ loading_logout, setLoading_logout ] = useState(false)

	const logout = () => {

		setLoading_logout(true)

		axiosPrivate.delete('/logout').then(() => {
			
			query_client.clear()
			setAuth({ accessToken: '' })
			navigate('/registration_and_login', { replace: true })
				
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
						
						<div>
							{change_dark_mode?.isPending && <>
								<div className='popup_options_loading_darkmode-container'>
									<LoaderBox className='popup_options_loading_darkmode' dark={true}/>
								</div>
							</>}
							
							{!change_dark_mode?.isPending &&
								<input
									type='checkbox'
									checked={darkmode}
									onChange={() => change_dark_mode.mutate()}
								/>
							}

							<label>Dark mode</label>
						</div>

						<span>Server Version: {server_version}</span>
						
					</section>

					<section>
						<Link 
							to='/profile'
							className='button button_reverse_green button_scale_2'
						>Profil</Link>
					</section>

					<section>
						<Link 
							to='/analytics'
							className='button button_reverse_green button_scale_2'
						>Statistiken</Link>
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
