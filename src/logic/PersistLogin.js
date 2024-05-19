

import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth'

import Loader from '../components/others/Loader'





export default function PersistLogin() {

	const location = useLocation()
	const navigate = useNavigate()
	const refresh = useRefreshToken()
	const { auth } = useAuth()
	
	const [isLoading, setIsLoading] = useState(true)





	useEffect(() => {
		
		const verifyRefreshToken = async () => {
			try {
				await refresh()
			} catch(err) {
				navigate(`/?next=${location.pathname}${location.search}`)
			} finally {
				setIsLoading(false)
			}
		} 
	
		!auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)

	}, [])





	return (<>

		{isLoading ? <Loader loaderVisible={true}/> : <Outlet/>}

	</>)
	
}
