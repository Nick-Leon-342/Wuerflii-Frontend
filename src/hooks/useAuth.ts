

import { useContext, useDebugValue } from 'react'

import Context__Auth from '../context/Provider__Auth'
import type { Type__AuthContext } from '../types/Type__Context__Auth'





export default function useAuth() {
	const { auth } = useContext<Type__AuthContext>(Context__Auth)
    useDebugValue(auth, auth => auth?.user ? 'Logged In' : 'Logged Out')
    return useContext(Context__Auth)
}
