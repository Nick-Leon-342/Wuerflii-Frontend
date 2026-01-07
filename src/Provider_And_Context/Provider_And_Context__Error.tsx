

import { createContext, useState, type ReactNode } from 'react'

import PopupError from '../components/Popup/Popup__Error'

import type { Type__Context__Error } from '../types/Type__Context/Type__Context__Error'





const Context__Error = createContext<Type__Context__Error>({
	error: 		'', 
	setError: 	() => {}, 
})
export default Context__Error

interface Props__Provider__Error { children: ReactNode }





export const Provider_And_Context__Error = ({ children }: Props__Provider__Error) => {

	const [ error, setError ] = useState<string>('')

	return <>
		<Context__Error.Provider value={{ error, setError }}>

			<PopupError
				setError={setError}
				error={error}
			/>

			{children}

		</Context__Error.Provider>
	</>

}
