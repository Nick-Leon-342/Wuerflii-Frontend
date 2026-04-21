

import { Navigate, Outlet } from 'react-router-dom'

import { useUser } from '@/hooks/useUser'

export default function Public_Route() {

	const {
		user, 
		loading_user, 
	} = useUser()

	if(loading_user) return null

	if(user) return <Navigate to='/' replace/>

	return <Outlet/>
	
}
