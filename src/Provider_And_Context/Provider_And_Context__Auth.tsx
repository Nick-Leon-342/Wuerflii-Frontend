

import { createContext, useState, type ReactNode } from 'react'

import type { Type__Auth } from '../types/Type__Auth'
import type { Type__Context__Auth } from '../types/Type__Context/Type__Context__Auth'





const Context__Auth = createContext<Type__Context__Auth>({
	auth: { user: null }, 
	setAuth: () => {}, 
})
export default Context__Auth

interface Props__Provider__Auth { children: ReactNode }





export const Provider_And_Context__Auth = ({ children }: Props__Provider__Auth) => {

    const [ auth, setAuth ] = useState<Type__Auth>({ user: null })

	const value: Type__Context__Auth = { auth, setAuth }

    return <Context__Auth.Provider value={value}>{children}</Context__Auth.Provider>

}
