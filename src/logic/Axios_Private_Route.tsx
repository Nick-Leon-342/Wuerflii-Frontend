

import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import { useUser } from '@/hooks/useUser'
import { api } from '@/api/axios'

import { toast } from 'sonner'





export default function Axios_Private_Route() {

	const {
		user, 
		setUser, 
		loading_user, 
	} = useUser()

	const location		= useLocation()
	const { t }			= useTranslation()
	const query_client	= useQueryClient()





	useEffect(() => {
		const interceptor = api.interceptors.response.use(
			( response ) => response, 
			( error ) => {
				if(error.response && error.response.status === 401) {
					setUser(null)
					query_client.clear()
					toast.error(t('error.session_timeout'))
				}
				return Promise.reject(error)
			}
		)

		return () => api.interceptors.response.eject(interceptor)
	}, [ query_client, setUser, t ])





	if(loading_user) return null
	if(!user) return <Navigate to='/registration_and_login' state={{ from: location }} replace/>
	return <Outlet/>

}
