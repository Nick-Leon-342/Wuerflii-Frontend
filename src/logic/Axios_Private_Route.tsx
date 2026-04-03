

import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'

import useRedirectToLogin from '@/hooks/useRedirectToLogin'
import { api } from '@/api/axios'

import { toast } from 'sonner'





export default function Axios_Private_Route() {

	const redirect_to_login = useRedirectToLogin()
	const { t } = useTranslation()

	useEffect(() => {
		const interceptor = api.interceptors.response.use(
			( response ) => response, 
			( error ) => {
				if(error.response && error.response.status === 401) {
					toast.error(t('error.session_invalid'))
					redirect_to_login()
				}
				return Promise.reject(error)
			}
		)

		return () => api.interceptors.response.eject(interceptor)
	}, [])

	return <Outlet/>

}
