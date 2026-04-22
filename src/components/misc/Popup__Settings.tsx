

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import packageJson from '../../../package.json'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Context__Server_Version from '@/Provider_And_Context/Provider_And_Context__Server_Version'
import type { Type__User_PATCH } from '@/types/Zod__User'
import { darkMode_string } from '@/logic/utils'
import { patch__user } from '../../api/user'
import { useUser } from '@/hooks/useUser'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Languages, Moon, Sun, User } from 'lucide-react'
import Custom_Button from '../misc/Custom_Button'
import { Spinner } from '../ui/spinner'
import { Button } from '../ui/button'





export default function Popup__Settings() {

	const {
		user, 
		setUser, 
	} = useUser()

	const navigate 				= useNavigate()
	const { t, i18n }			= useTranslation()
	const query_client 			= useQueryClient()
	const { server_version }	= useContext(Context__Server_Version)

	const [ darkMode, setDarkMode ] = useState(localStorage.getItem(darkMode_string) === 'true')

	const change_dark_mode = useMutation({
		mutationFn: (json: Type__User_PATCH) => patch__user(json), 
		onSuccess: (_, json) => {
			setUser(prev => {
				if(!prev) return prev
				return { ...prev, ...json }
			})
			setDarkMode(!user?.DarkMode)
			query_client.setQueryData([ 'user' ], { ...user, DarkMode: !user?.DarkMode })
		}
	})

	const list__languages = [
		{ Name: 'English', 	Code: 'en' }, 
		{ Name: 'Deutsch', 	Code: 'de' }, 
	]





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
			change_dark_mode.mutate({ DarkMode: !user?.DarkMode })
		}

	}





	return <>
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					className='fixed p-2 bottom-4 right-4 h-12 w-12 z-41 bg-card! shadow-xl'
				><User className='w-8! h-8!'/></Button>
			</DialogTrigger>



			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>{t('settings')}</DialogTitle>
				</DialogHeader>

				<div className='popup__options flex flex-col gap-4'>

					{/* ____________________ DarkMode ____________________ */}
					
					<Custom_Button
						variant='outline'
						onClick={change_darkmode}
						SVG={change_dark_mode.isPending 
								? <Spinner/>
								: (darkMode ? <Moon/> : <Sun/>)
						}
						text={darkMode ? t('ui_mode.dark') : t('ui_mode.light')}
						className='flex flex-row h-12 justify-baseline w-full text-lg'
					/>



					{/* ____________________ Languages ____________________ */}

					<Select
						value={i18n.language?.split('-')[0] || 'de'}
						onValueChange={(value) => i18n.changeLanguage(value)}
					>
						<SelectTrigger className='pl-8'>
							<Languages className='absolute left-7'/>
							<SelectValue/>
						</SelectTrigger>

						<SelectContent>
							<SelectGroup>
								{list__languages.map(language_json => (
									<SelectItem
										key={language_json.Code}
										value={language_json.Code}
										className='text-lg cursor-pointer'
									>{language_json.Name}</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>



					{/* ____________________ Profile ____________________ */}

					{user !== null && <>
						<Button 
							variant='link'
							onClick={() => navigate('/profile')}
							className='text-lg w-full h-fit'
						>{t('profile.account')}</Button>
					</>}

				</div>

				<DialogFooter>
					<div className='flex flex-col [&_div]:flex [&_div]:flex-row [&_div]:justify-between [&_div]:gap-1'>
						<div>
							<span>{t('version.app')}:</span>
							<span>{packageJson.version}</span>
						</div>
						<div>
							<span>{t('version.server')}:</span>
							<span>{server_version}</span>
						</div>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</>
}
