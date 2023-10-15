

import { Outlet, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth'
import { clearSessionStorage } from './utils'

const PersistLogin = () => {

	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(true)
	const refresh = useRefreshToken()
	const { auth } = useAuth()

	useEffect(() => {
		
		const verifyRefreshToken = async () => {
			try {
				await refresh()
			} catch(err) {
				clearSessionStorage()
				navigate('/login')
			} finally {
				setIsLoading(false)
			}
		} 
	
		!auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)

	}, [])

	return (
		<>
			{isLoading ? <p>Loading...</p> : <Outlet/>}
		</>
	)
	
}

export default PersistLogin
