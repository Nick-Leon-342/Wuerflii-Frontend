

import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import useErrorHandling from '@/hooks/useErrorHandling'
import { delete__user } from '@/api/user'
import { useUser } from '@/hooks/useUser'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Profile__Avatar_Edit from '@/components/profile/Profile__Avatar_Edit'
import Profile__Username from '@/components/profile/Profile__Username'
import Profile__Password from '@/components/profile/Profile__Password'
import Popup__Settings from '@/components/misc/Popup__Settings'
import Custom_Button from '@/components/misc/Custom_Button'
import Previous from '@/components/misc/Previous'
import { LogOut, UserX } from 'lucide-react'
import { toast } from 'sonner'





export default function Profile() {

	const {
		logout, 
		setUser, 
		loading_logout, 
	} = useUser()

	const navigate		= useNavigate()
	const { t }			= useTranslation()
	const query_client	= useQueryClient()
	const handle_error	= useErrorHandling()

	const [ loading__delete_account, setLoading__delete_account ] = useState<boolean>(false)





	function delete_account() {

		if(!window.confirm(t('profile.confirm_user_deletion'))) return
		if(!window.confirm(t('profile.confirm_user_deletion_confirm'))) return

		setLoading__delete_account(true)

		delete__user().then(() => {

			setUser(null)
			query_client.clear()
			toast.success(t('successfully.deleted'))

		}).catch(err => {

			handle_error({
				err, 
			})

		}).finally(() => setLoading__delete_account(false))
	}





	return <>
	
		<Popup__Settings/>
	
	



		<div className='flex flex-col w-9/10 gap-4 md:w-150 [&_button]:not-first:justify-start'>

			<Previous onClick={() => navigate(-1)}/>



			{/* ____________________ Change credentials ____________________ */}

			<Card className='bg-background'>
				<CardHeader>
					<CardTitle>{t('profile.account')}</CardTitle>
				</CardHeader>

				<CardContent>

					<Profile__Avatar_Edit/>
					
					<Profile__Username/>

					<Profile__Password/>

				</CardContent>
			</Card>
			


			{/* ____________________ Danger Zone ____________________ */}

			<>

				<h1 className='text-xl'>{t('profile.danger_zone')}</h1>
			
				<Custom_Button
					SVG={<LogOut/>}
					onClick={logout}
					text={t('profile.logout')}
					variant='destructive'
					loading={loading_logout}
				/>

				<Custom_Button
					SVG={<UserX/>}
					variant='destructive'
					onClick={delete_account}
					text={t('profile.delete')}
					loading={loading__delete_account}
				/>
			</>

		</div>

	</>
}
