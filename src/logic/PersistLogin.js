

import { Outlet, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth'
import Loader from '../components/Loader'





export default function PersistLogin() {

	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(true)
	const refresh = useRefreshToken()
	const { auth } = useAuth()

	useEffect(() => {
		
		const verifyRefreshToken = async () => {
			try {
				await refresh()
			} catch(err) {
				navigate('/login')
			} finally {
				setIsLoading(false)
			}
		} 
	
		!auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)

	}, [])

	return (
		<>
			{isLoading ? <Loader loaderVisible={true}/> : <Outlet/>}
		</>
	)
	
}
