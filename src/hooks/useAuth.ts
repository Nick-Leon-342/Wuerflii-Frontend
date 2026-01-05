

import { useContext, useDebugValue } from 'react'

import Context__Auth from '../Provider_And_Context/Provider_And_Context__Auth'
import type { Type__Context__Auth } from '../types/Type__Context/Type__Context__Auth'





export default function useAuth() {
	const { auth } = useContext<Type__Context__Auth>(Context__Auth)
    useDebugValue(auth, auth => auth?.user ? 'Logged In' : 'Logged Out')
    return useContext(Context__Auth)
}
