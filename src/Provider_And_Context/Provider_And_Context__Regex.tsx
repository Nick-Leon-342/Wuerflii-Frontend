

import { createContext, useEffect, useState, type ReactNode } from 'react'

import useAxiosPrivate from '../hooks/useAxiosPrivate'

import type { Type__Context__Regex } from '../types/Type__Context/Type__Context__Regex'
import type { Type__Server_Response__Regex } from '../types/Type__Server_Response/Type__Server_Response__Regex'





const Context__Regex = createContext<Type__Context__Regex>({
		requesting_regex:				false, 

		NAME_MIN_CHARACTER: 			0, 
		NAME_MAX_CHARACTER:				0, 

		NAME_REGEX:						new RegExp('$.^'), 
		NAME_REGEX_MINMAX:				new RegExp('$.^'), 
		NAME_REGEX_LETTERFIRST:			new RegExp('$.^'), 
		NAME_REGEX_ALLOWEDCHARS: 		new RegExp('$.^'),
		
		PASSWORD_MIN_CHARACTER:			0, 
		PASSWORD_MAX_CHARACTER: 		0, 

		PASSWORD_REGEX:					new RegExp('$.^'), 
		PASSWORD_REGEX_MINMAX:			new RegExp('$.^'), 
		PASSWORD_REGEX_ALLOWEDCHARS:	new RegExp('$.^'), 
		PASSWORD_REGEX_ALLOWEDSYMBOLS:	new RegExp('$.^'), 
})
export default Context__Regex

interface Props__Provider__Regex { children: ReactNode }





export const Provider_And_Context__Regex = ({ children }: Props__Provider__Regex) => {

	const axiosPrivate = useAxiosPrivate()

	const [ json__response,		setJson__response	] = useState<Type__Context__Regex>({
		requesting_regex:				false, 

		NAME_MIN_CHARACTER: 			0, 
		NAME_MAX_CHARACTER:				0, 

		NAME_REGEX:						new RegExp('$.^'), 
		NAME_REGEX_MINMAX:				new RegExp('$.^'), 
		NAME_REGEX_LETTERFIRST:			new RegExp('$.^'), 
		NAME_REGEX_ALLOWEDCHARS: 		new RegExp('$.^'), 
		
		PASSWORD_MIN_CHARACTER:			0, 
		PASSWORD_MAX_CHARACTER: 		0, 

		PASSWORD_REGEX:					new RegExp('$.^'), 
		PASSWORD_REGEX_MINMAX:			new RegExp('$.^'), 
		PASSWORD_REGEX_ALLOWEDCHARS:	new RegExp('$.^'), 
		PASSWORD_REGEX_ALLOWEDSYMBOLS:	new RegExp('$.^'), 
	})





	useEffect(() => {
		function request_regex() {

			setJson__response(prev => ({ ...prev, requesting_regex: true }))
	
			axiosPrivate.get<Type__Server_Response__Regex>('/auth/regex').then(response  => {
	
				const {
					NAME_MIN_CHARACTER, 
					NAME_MAX_CHARACTER, 
					
					NAME_REGEX, 
					NAME_REGEX_MINMAX, 
					NAME_REGEX_LETTERFIRST, 
					NAME_REGEX_ALLOWEDCHARS, 
				
				
					PASSWORD_MIN_CHARACTER, 
					PASSWORD_MAX_CHARACTER, 
				
					PASSWORD_REGEX, 
					PASSWORD_REGEX_MINMAX, 
					PASSWORD_REGEX_ALLOWEDCHARS, 
					PASSWORD_REGEX_ALLOWEDSYMBOLS, 
				} = response.data
	
				setJson__response({
					requesting_regex:				false, 

					NAME_MIN_CHARACTER, 
					NAME_MAX_CHARACTER, 
					
					NAME_REGEX:						new RegExp(NAME_REGEX), 
					NAME_REGEX_MINMAX:				new RegExp(NAME_REGEX_MINMAX), 
					NAME_REGEX_LETTERFIRST:			new RegExp(NAME_REGEX_LETTERFIRST), 
					NAME_REGEX_ALLOWEDCHARS:		new RegExp(NAME_REGEX_ALLOWEDCHARS), 
				
				
					PASSWORD_MIN_CHARACTER, 
					PASSWORD_MAX_CHARACTER, 
				
					PASSWORD_REGEX:					new RegExp(PASSWORD_REGEX), 
					PASSWORD_REGEX_MINMAX:			new RegExp(PASSWORD_REGEX_MINMAX), 
					PASSWORD_REGEX_ALLOWEDCHARS:	new RegExp(PASSWORD_REGEX_ALLOWEDCHARS), 
					PASSWORD_REGEX_ALLOWEDSYMBOLS:	new RegExp(PASSWORD_REGEX_ALLOWEDSYMBOLS), 
				})
	
			}).catch((err: Error) => {
				alert(`Ein unerwarteter Fehler trat auf.\n${err}`)
				setJson__response(prev => ({ ...prev, requesting_regex: false }))
			})
		}

		request_regex()
	}, []) // eslint-disable-line





	return <>
		<Context__Regex.Provider value={json__response}>

			{children}

		</Context__Regex.Provider>
	</>

}
