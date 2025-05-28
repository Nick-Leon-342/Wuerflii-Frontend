

import { createContext, useEffect, useState } from 'react'

import useAxiosPrivate from '../hooks/useAxiosPrivate'

export const RegexContext = createContext({})





export const Regex = ({ children }) => {

	const axiosPrivate = useAxiosPrivate()

	const [ requesting_regex, 				setRequesting_regex 				] = useState(false)
	
	const [ NAME_MIN_CHARACTER, 			setNAME_MIN_CHARACTER 				] = useState()
	const [ NAME_MAX_CHARACTER, 			setNAME_MAX_CHARACTER 				] = useState()
	
	const [ NAME_REGEX, 					setNAME_REGEX 						] = useState()
	const [ NAME_REGEX_MINMAX, 				setNAME_REGEX_MINMAX 				] = useState()
	const [ NAME_REGEX_LETTERFIRST, 		setNAME_REGEX_LETTERFIRST 			] = useState()
	const [ NAME_REGEX_ALLOWEDCHARS, 		setNAME_REGEX_ALLOWEDCHARS 			] = useState()


	const [ PASSWORD_MIN_CHARACTER, 		setPASSWORD_MIN_CHARACTER 			] = useState()
	const [ PASSWORD_MAX_CHARACTER, 		setPASSWORD_MAX_CHARACTER 			] = useState()

	const [ PASSWORD_REGEX, 				setPASSWORD_REGEX		 			] = useState()
	const [ PASSWORD_REGEX_MINMAX, 			setPASSWORD_REGEX_MINMAX 			] = useState()
	const [ PASSWORD_REGEX_ALLOWEDCHARS, 	setPASSWORD_REGEX_ALLOWEDCHARS 		] = useState()
	const [ PASSWORD_REGEX_ALLOWEDSYMBOLS, 	setPASSWORD_REGEX_ALLOWEDSYMBOLS 	] = useState()





	useEffect(() => {

		setRequesting_regex(true)

		axiosPrivate.get('/auth/regex').then(({ data }) => {

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

			setNAME_MIN_CHARACTER(NAME_MIN_CHARACTER)
			setNAME_MAX_CHARACTER(NAME_MAX_CHARACTER)

			setNAME_REGEX(new RegExp(NAME_REGEX))
			setNAME_REGEX_MINMAX(new RegExp(NAME_REGEX_MINMAX))
			setNAME_REGEX_LETTERFIRST(new RegExp(NAME_REGEX_LETTERFIRST))
			setNAME_REGEX_ALLOWEDCHARS(new RegExp(NAME_REGEX_ALLOWEDCHARS))


			setPASSWORD_MIN_CHARACTER(PASSWORD_MIN_CHARACTER)
			setPASSWORD_MAX_CHARACTER(PASSWORD_MAX_CHARACTER)

			setPASSWORD_REGEX(new RegExp(PASSWORD_REGEX))
			setPASSWORD_REGEX_MINMAX(new RegExp(PASSWORD_REGEX_MINMAX))
			setPASSWORD_REGEX_ALLOWEDCHARS(new RegExp(PASSWORD_REGEX_ALLOWEDCHARS))
			setPASSWORD_REGEX_ALLOWEDSYMBOLS(new RegExp(PASSWORD_REGEX_ALLOWEDSYMBOLS))

		}).catch(err => alert(`Ein unerwarteter Fehler trat auf.\n${err}`)).finally(() => setRequesting_regex(false))

		// eslint-disable-next-line
	}, [])





	return <>
		<RegexContext.Provider value={{
			requesting_regex, 

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
		}}>

			{children}

		</RegexContext.Provider>
	</>

}

export default Regex
