

import { createContext, useEffect, useState, type ReactNode } from 'react'

import useAxiosPrivate from '../hooks/useAxiosPrivate'

import type { Type__Context__Regex } from '../types/Type__Context/Type__Context__Regex'
import type { Type__Server_Response__Regex } from '../types/Type__Server_Response/Type__Server_Response__Regex'





const Context__Regex = createContext<Type__Context__Regex>({
		requesting_regex:				false, 

		NAME__MIN_CHARACTER: 			0, 
		NAME__MAX_CHARACTER:				0, 

		NAME__REGEX:						new RegExp('$.^'), 
		NAME__REGEX_MINMAX:				new RegExp('$.^'), 
		NAME__REGEX_LETTERFIRST:			new RegExp('$.^'), 
		NAME__REGEX_ALLOWEDCHARS: 		new RegExp('$.^'),
		
		PASSWORD__MIN_CHARACTER:			0, 
		PASSWORD__MAX_CHARACTER: 		0, 

		PASSWORD__REGEX:					new RegExp('$.^'), 
		PASSWORD__REGEX_MINMAX:			new RegExp('$.^'), 
		PASSWORD__REGEX_ALLOWEDCHARS:	new RegExp('$.^'), 
		PASSWORD__REGEX_ALLOWEDSYMBOLS:	new RegExp('$.^'), 
})
export default Context__Regex

interface Props__Provider__Regex { children: ReactNode }





export const Provider_And_Context__Regex = ({ children }: Props__Provider__Regex) => {

	const axiosPrivate = useAxiosPrivate()

	const [ json__response,		setJson__response	] = useState<Type__Context__Regex>({
		requesting_regex:				false, 

		NAME__MIN_CHARACTER: 			0, 
		NAME__MAX_CHARACTER:				0, 

		NAME__REGEX:						new RegExp('$.^'), 
		NAME__REGEX_MINMAX:				new RegExp('$.^'), 
		NAME__REGEX_LETTERFIRST:			new RegExp('$.^'), 
		NAME__REGEX_ALLOWEDCHARS: 		new RegExp('$.^'), 
		
		PASSWORD__MIN_CHARACTER:			0, 
		PASSWORD__MAX_CHARACTER: 		0, 

		PASSWORD__REGEX:					new RegExp('$.^'), 
		PASSWORD__REGEX_MINMAX:			new RegExp('$.^'), 
		PASSWORD__REGEX_ALLOWEDCHARS:	new RegExp('$.^'), 
		PASSWORD__REGEX_ALLOWEDSYMBOLS:	new RegExp('$.^'), 
	})





	useEffect(() => {
		function request_regex() {

			setJson__response(prev => ({ ...prev, requesting_regex: true }))
	
			axiosPrivate.get<Type__Server_Response__Regex>('/auth/regex').then(response  => {
	
				const {
					NAME__MIN_CHARACTER, 
					NAME__MAX_CHARACTER, 
					
					NAME__REGEX, 
					NAME__REGEX_MINMAX, 
					NAME__REGEX_LETTERFIRST, 
					NAME__REGEX_ALLOWEDCHARS, 
				
				
					PASSWORD__MIN_CHARACTER, 
					PASSWORD__MAX_CHARACTER, 
				
					PASSWORD__REGEX, 
					PASSWORD__REGEX_MINMAX, 
					PASSWORD__REGEX_ALLOWEDCHARS, 
					PASSWORD__REGEX_ALLOWEDSYMBOLS, 
				} = response.data
	
				setJson__response({
					requesting_regex:				false, 

					NAME__MIN_CHARACTER, 
					NAME__MAX_CHARACTER, 
					
					NAME__REGEX:						new RegExp(NAME__REGEX), 
					NAME__REGEX_MINMAX:				new RegExp(NAME__REGEX_MINMAX), 
					NAME__REGEX_LETTERFIRST:			new RegExp(NAME__REGEX_LETTERFIRST), 
					NAME__REGEX_ALLOWEDCHARS:		new RegExp(NAME__REGEX_ALLOWEDCHARS), 
				
				
					PASSWORD__MIN_CHARACTER, 
					PASSWORD__MAX_CHARACTER, 
				
					PASSWORD__REGEX:					new RegExp(PASSWORD__REGEX), 
					PASSWORD__REGEX_MINMAX:			new RegExp(PASSWORD__REGEX_MINMAX), 
					PASSWORD__REGEX_ALLOWEDCHARS:	new RegExp(PASSWORD__REGEX_ALLOWEDCHARS), 
					PASSWORD__REGEX_ALLOWEDSYMBOLS:	new RegExp(PASSWORD__REGEX_ALLOWEDSYMBOLS), 
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
