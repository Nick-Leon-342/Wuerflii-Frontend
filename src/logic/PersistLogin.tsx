

import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import useAuth from '../hooks/useAuth'
import useRefreshToken from '../hooks/useRefreshToken'

import Loader from '../components/Loader/Loader'





export default function PersistLogin() {

	const location = useLocation()
	const navigate = useNavigate()
	const refresh = useRefreshToken()
	const { auth } = useAuth()
	
	const [ isLoading, setIsLoading ] = useState(true)





	useEffect(() => {
		
		const verifyRefreshToken = async () => {
			try {
				await refresh()
			} catch(err) {
				console.error(err)
				navigate(`/registration_and_login?next=${location.pathname}${location.search}`)
			} finally {
				setIsLoading(false)
			}
		} 
	
		if(!auth?.accessToken) {
			verifyRefreshToken()
		} else {
			setIsLoading(false)
		}

		// eslint-disable-next-line
	}, [])





	return <>

		{isLoading ? <Loader loading={true}/> : <Outlet/>}

	</>
	
}
