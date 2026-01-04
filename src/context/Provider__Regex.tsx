

import { createContext, useEffect, useState, type ReactNode } from 'react'

import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { Type__Context__Regex } from '../types/Type__Context__Regex'
import type { Type__Server_Response__Regex } from '../types/Server_Response/Type__Server_Response__Regex'

export const RegexContext = createContext({})





interface Props__Provider__Regex { children: ReactNode }

export const Provider__Regex = ({ children }: Props__Provider__Regex) => {

	const axiosPrivate = useAxiosPrivate()

	const [ json__regex,	setJson__regex	] = useState<Type__Context__Regex>({
		NAME_MIN_CHARACTER: 			0, 
		NAME_MAX_CHARACTER:				0, 

		NAME_REGEX:						null, 
		NAME_REGEX_MINMAX:				null, 
		NAME_REGEX_LETTERFIRST:			null, 
		NAME_REGEX_ALLOWEDCHARS: 		null,
		
		PASSWORD_MIN_CHARACTER:			0, 
		PASSWORD_MAX_CHARACTER: 		0, 

		PASSWORD_REGEX:					null, 
		PASSWORD_REGEX_MINMAX:			null, 
		PASSWORD_REGEX_ALLOWEDCHARS:	null, 
		PASSWORD_REGEX_ALLOWEDSYMBOLS:	null, 
	})

	const [ requesting_regex, 				setRequesting_regex 				] = useState(false)
	
	// const [ NAME_MIN_CHARACTER, 			setNAME_MIN_CHARACTER 				] = useState()
	// const [ NAME_MAX_CHARACTER, 			setNAME_MAX_CHARACTER 				] = useState()
	
	// const [ NAME_REGEX, 					setNAME_REGEX 						] = useState()
	// const [ NAME_REGEX_MINMAX, 				setNAME_REGEX_MINMAX 				] = useState()
	// const [ NAME_REGEX_LETTERFIRST, 		setNAME_REGEX_LETTERFIRST 			] = useState()
	// const [ NAME_REGEX_ALLOWEDCHARS, 		setNAME_REGEX_ALLOWEDCHARS 			] = useState()


	// const [ PASSWORD_MIN_CHARACTER, 		setPASSWORD_MIN_CHARACTER 			] = useState()
	// const [ PASSWORD_MAX_CHARACTER, 		setPASSWORD_MAX_CHARACTER 			] = useState()

	// const [ PASSWORD_REGEX, 				setPASSWORD_REGEX		 			] = useState()
	// const [ PASSWORD_REGEX_MINMAX, 			setPASSWORD_REGEX_MINMAX 			] = useState()
	// const [ PASSWORD_REGEX_ALLOWEDCHARS, 	setPASSWORD_REGEX_ALLOWEDCHARS 		] = useState()
	// const [ PASSWORD_REGEX_ALLOWEDSYMBOLS, 	setPASSWORD_REGEX_ALLOWEDSYMBOLS 	] = useState()





	useEffect(() => {
		async function request_regex() {

			setRequesting_regex(true)
	
			const response = await axiosPrivate.get<Type__Server_Response__Regex>('/auth/regex')
	
			axiosPrivate.get<Type__Server_Response__Regex>('/auth/regex').then((data)  => {
	
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
				} = data
	
				setJson__regex({
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
	
			}).catch((err: Error) => alert(`Ein unerwarteter Fehler trat auf.\n${err}`)).finally(() => setRequesting_regex(false))
		}

		request_regex()
	}, []) // eslint-disable-line





	return <>
		<RegexContext.Provider value={json__regex}>

			{children}

		</RegexContext.Provider>
	</>

}

export default Provider__Regex
