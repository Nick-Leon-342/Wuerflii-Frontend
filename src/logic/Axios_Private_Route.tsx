

import { useNavigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'

import useRedirectToLogin from '@/hooks/useRedirectToLogin'
import { api } from '@/api/axios'





export default function Axios_Private_Route() {

	const redirect_to_login = useRedirectToLogin()
	const navigate = useNavigate()

	useEffect(() => {
		const interceptor = api.interceptors.response.use(
			( response ) => response, 
			( error ) => {
				if(error.response && error.response.status === 401) {
					redirect_to_login()
				}
				return Promise.reject(error)
			}
		)

		return () => api.interceptors.response.eject(interceptor)
	}, [ navigate, redirect_to_login ])

	return <Outlet/>

}
