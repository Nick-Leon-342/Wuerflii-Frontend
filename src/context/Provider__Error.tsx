

import { createContext, useState, type ReactNode } from 'react'

import PopupError from '../components/Popup/Popup_Error'

import type { Type__Context__Error } from '../types/Type__Context__Error'





const Context__Error = createContext<Type__Context__Error>({
	error: '', 
	setError: () => {}, 
})

interface Props__Provider__Error {
	children: ReactNode;
}





export const Provider__Error = ({ children }: Props__Provider__Error) => {

	const [ error, setError ] = useState<string>('')

	const value: Type__Context__Error = { error, setError }



	return <>
		<Context__Error.Provider value={value}>

			<PopupError
				setError={setError}
				error={error}
			/>

			{children}

		</Context__Error.Provider>
	</>

}

export default Context__Error
