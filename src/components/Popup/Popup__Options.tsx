

import './scss/Popup__Options.scss'

import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import Context__Server_Version from '../../Provider_And_Context/Provider_And_Context__Server_Version'

import Popup from './Popup'
import LoaderBox from '../Loader/Loader_Box'

import Settings from '../../svg/Settings.svg?react'
import Translate from '../../svg/Translate.svg?react'

import { patch__user } from '../../api/user'

import type { Type__User } from '../../types/Type__User'
import { useTranslation } from 'react-i18next'




interface Props__Popup__Options {
	user:	Type__User | undefined | null
}

export default function Popup__Options({
	user, 
}: Props__Popup__Options) {

	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const { t, i18n } = useTranslation()

	const darkMode_string = 'Wuerflii_DarkMode'
	const { server_version } = useContext(Context__Server_Version)

	const [ show_options, 	setShow_options ] = useState(false)
	const [ darkMode, 		setDarkMode		] = useState(localStorage.getItem(darkMode_string) === 'true')

	const change_dark_mode = useMutation({
		mutationFn: () => patch__user(axiosPrivate, { DarkMode: !user?.DarkMode }), 
		onSuccess: () => {
			setDarkMode(!user?.DarkMode)
			query_client.setQueryData([ 'user' ], { ...user, DarkMode: !user?.DarkMode })
		}
	})

	const list__languages = [
		{ Name: 'English', 	Code: 'en' }, 
		{ Name: 'Deutsch', 	Code: 'de' }, 
	]





	// useEffect(() => {

	// 	if(localStorage.getItem(darkMode_string) === 'true') document.body.classList.add('dark')

	// }, []) // eslint-disable-line

	useEffect(() => {
		function configure_darkmode() {
			
			if(!user) return
			setDarkMode(user.DarkMode)

		}
		configure_darkmode()
	}, [ user ])

	useEffect(() => {
		
		if(darkMode) {
			document.body.classList.add('dark')
			localStorage.setItem(darkMode_string, 'true')
		} else {
			document.body.classList.remove('dark')
			localStorage.setItem(darkMode_string, 'false')
		}

	}, [ darkMode ])

	function change_darkmode() {

		if(user === null) {
			setDarkMode(prev => !prev)
		} else {
			change_dark_mode.mutate()
		}

	}





	return <>

		<button
			onClick={() => setShow_options(true)} 
			className='button button_reverse button_scale_3 popup__options--icon'
		><Settings/></button>
	




		<Popup
			title={t('settings')}
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
									checked={darkMode}
									onChange={change_darkmode}
								/>
							}

							<label>{t('darkmode')}</label>
						</div>

						<span>{t('server_version')}: {server_version}</span>
						
					</section>



					<hr/>

					<section className='language'>
						<span>
							<Translate/>
							{t('language')}
						</span>
						<select
							value={i18n.language}
							onChange={(e) => i18n.changeLanguage(e.target.value)}
						>
							{list__languages.map(language_json => (
								<option key={language_json.Code} value={language_json.Code}>
									{language_json.Name}
								</option>
							))}
						</select>
					</section>



					{user !== null && <>
						<hr/>

						<Link 
							to='/profile'
							className='button button_scale_2 popup__options--profile'
						>{t('account')}</Link>
					</>}

				</div>
				
			</div>
		</Popup>
	</>
}
