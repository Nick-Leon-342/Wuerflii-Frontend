

import Context__User from '@/Provider_And_Context/Provider_And_Context__User'
import { useContext } from 'react'





export function useUser() {
	const context = useContext(Context__User)
	if(!context) throw new Error('useUser can only be used in the provider.')
	return context
}
