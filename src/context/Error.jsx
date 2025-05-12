

import { createContext, useState } from 'react'

import PopupError from '../components/Popup/Popup_Error'

export const ErrorContext = createContext({})





export const Error = ({ children }) => {

	const [ error, setError ] = useState('')





	return <>
		<ErrorContext.Provider value={{ error, setError }}>

			<PopupError
				setError={setError}
				error={error}
			/>

			{children}

		</ErrorContext.Provider>
	</>

}

export default Error
