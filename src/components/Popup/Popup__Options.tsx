

import './scss/Popup__Options.scss'

import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import Context__Server_Version from '../../Provider_And_Context/Provider_And_Context__Server_Version'

import Popup from './Popup'
import LoaderBox from '../Loader/Loader_Box'

import Settings from '../../svg/Settings.svg?react'

import { patch__user } from '../../api/user'

import type { Type__User } from '../../types/Type__User'




interface Props__Popup__Options {
	user:	Type__User | undefined
}

export default function Popup__Options({
	user, 
}: Props__Popup__Options) {

	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()

	const { server_version } = useContext(Context__Server_Version)

	const [ show_options, setShow_options ] = useState(false)

	const darkMode_string = 'Wuerflii_DarkMode'

	const change_dark_mode = useMutation({
		mutationFn: () => patch__user(axiosPrivate, { DarkMode: !user?.DarkMode }), 
		onSuccess: () => {
			query_client.setQueryData([ 'user' ], { ...user, DarkMode: !user?.DarkMode })
		}
	})





	useEffect(() => {

		if(localStorage.getItem(darkMode_string) === 'true') document.body.classList.add('dark')

	}, [])

	useEffect(() => {
		function configure_darkmode() {
			
			if(!user) return
			
			if(user.DarkMode) {
				document.body.classList.add('dark')
				localStorage.setItem(darkMode_string, 'true')
			} else {
				document.body.classList.remove('dark')
				localStorage.setItem(darkMode_string, 'false')
			}

		}
		configure_darkmode()
	}, [ user ])





	return <>

		<button
			onClick={() => setShow_options(true)} 
			className='button button_reverse button_scale_3 popup__options--icon'
		><Settings/></button>
	




		<Popup
			title='Einstellungen'
			show_popup={show_options}
			setShow_popup={setShow_options}
		>
			<div className='popup__options'>

				<div className='box'>

					<section className='darkmode'>
						
						<div>
							{change_dark_mode?.isPending && <>
								<div className='popup__options_loading_darkmode-container'>
									<LoaderBox className='popup__options_loading_darkmode' dark={true}/>
								</div>
							</>}
							
							{!change_dark_mode?.isPending &&
								<input
									type='checkbox'
									checked={Boolean(user?.DarkMode)}
									onChange={() => change_dark_mode.mutate()}
								/>
							}

							<label>Dark mode</label>
						</div>

						<span>Server Version: {server_version}</span>
						
					</section>

					<hr/>

					<Link 
						to='/profile'
						className='button button_scale_2 popup__options--profile'
					>Account</Link>

				</div>
				
			</div>
		</Popup>
	</>
}
