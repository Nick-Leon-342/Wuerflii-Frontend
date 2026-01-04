

import { createContext, useState, type ReactNode } from 'react'

import type { Type__Auth } from '../types/Type__Auth'
import type { Type__Context__Auth } from '../types/Type__Context__Auth'





const Context__Auth = createContext<Type__Context__Auth>({
	auth: { user: null }, 
	setAuth: () => {}, 
})

interface Props__Provider__Auth {
	children: ReactNode;
}





export const Provider__Auth = ({ children }: Props__Provider__Auth) => {

    const [ auth, setAuth ] = useState<Type__Auth>({ user: null })

	const value: Type__Context__Auth = { auth, setAuth }

    return <Context__Auth.Provider value={value}>{children}</Context__Auth.Provider>

}

export default Context__Auth
