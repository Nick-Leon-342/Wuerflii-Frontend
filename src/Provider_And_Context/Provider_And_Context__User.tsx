

import { createContext, useEffect, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import useErrorHandling from '@/hooks/useErrorHandling'
import type { Type__User } from '@/types/Zod__User'
import { delete__logout } from '@/api/auth'
import { get__user } from '@/api/user'

import Wuerflii from '@/svg/wuerflii.svg?react'
import { toast } from 'sonner'





interface Type__Context__User {
	user:			Type__User | null
	setUser:		React.Dispatch<React.SetStateAction<Type__User | null>>
	loading_user:	boolean

	logout:			() => void
	loading_logout:	boolean
}

const Context__User = createContext<Type__Context__User | null>(null)
export default Context__User





export const Provider_And_Context__User = ({ children }: { children: ReactNode }) => {

	const { t }			= useTranslation()
	const query_client	= useQueryClient()
	const handle_error	= useErrorHandling()

	const [ user, 				setUser				] = useState<Type__User | null>(null)
	const [ loading_user, 		setLoading_user		] = useState<boolean>(true)
	const [ loading_logout, 	setLoading_logout	] = useState<boolean>(false)





	useEffect(() => {

		get__user().then(user => {
			setUser(user)
		}).catch(err => {
			console.log(err)
			toast.error(t('error.session_timeout'))
			setUser(null)
		}).finally(() => setLoading_user(false))

	}, [])

	function logout() {

		setLoading_logout(true)
		
		delete__logout().then(() => {

			setUser(null)
			query_client.clear()
			toast.success(t('successfully.logged_out'))
				
		}).catch(err => {

			handle_error({
				err
			})
			
		}).finally(() => { setLoading_logout(false) })

	}





	return <>
		<Context__User.Provider 
			value={{
				user, 
				setUser, 
				loading_user, 

				logout, 
				loading_logout, 
			}}
		>
			{loading_user
				? <div className='grid place-items-center h-dvh'><Wuerflii className='w-12 h-12 [&_path]:fill-muted-foreground animate-pulse'/></div>
				: children
			}
		</Context__User.Provider>
	</>
}
