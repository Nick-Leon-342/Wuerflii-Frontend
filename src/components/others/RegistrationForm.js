

import './scss/RegistrationForm.scss'

import { useEffect, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import FancyInput from './FancyInput'





export default function RegistrationForm({ Name, setName, Password, setPassword, isRequired, NAME_REGEX, setNAME_REGEX, PASSWORD_REGEX, setPASSWORD_REGEX }) {

	const axiosPrivate = useAxiosPrivate()

	const [ infoName, setInfoName ] = useState(true)

	
	const [ NAME_MIN_CHARACTER, setNAME_MIN_CHARACTER ] = useState()
	const [ NAME_MAX_CHARACTER, setNAME_MAX_CHARACTER ] = useState()
	
	const [ NAME_REGEX_MINMAX, setNAME_REGEX_MINMAX ] = useState()
	const [ NAME_REGEX_LETTERFIRST, setNAME_REGEX_LETTERFIRST ] = useState()
	const [ NAME_REGEX_ALLOWEDCHARS, setNAME_REGEX_ALLOWEDCHARS ] = useState()


	const [ PASSWORD_MIN_CHARACTER, setPASSWORD_MIN_CHARACTER ] = useState()
	const [ PASSWORD_MAX_CHARACTER, setPASSWORD_MAX_CHARACTER ] = useState()

	const [ PASSWORD_REGEX_MINMAX, setPASSWORD_REGEX_MINMAX ] = useState()
	const [ PASSWORD_REGEX_ALLOWEDCHARS, setPASSWORD_REGEX_ALLOWEDCHARS ] = useState()
	const [ PASSWORD_REGEX_ALLOWEDSYMBOLS, setPASSWORD_REGEX_ALLOWEDSYMBOLS ] = useState()





	useEffect(() => {

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

		}).catch((err) => {
			console.log(err)
		})

	}, [])

	const getIcon = (valid) => {

		return valid ?
			<svg className='valid' viewBox='0 -960 960 960'><path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/></svg>
			:
			<svg viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
	
	}

	const row = (REGEX, Value, Text) => {

		if(!REGEX) return 
		
		return (
			<div className='registrationform_error-row'>
				{getIcon(REGEX.test(Value))}
				<label>{Text}</label>
			</div>
		)

	}





	return (
		<>
		
			<FancyInput 
				id='Username' 
				type='text' 
				classNames={`${Name && NAME_REGEX.test(Name) ? 'green' : ''} ${Name && !NAME_REGEX.test(Name) ? 'red' : ''}`} 
				text='Benutzername' 
				value={Name} 
				setValue={setName} 
				isRequired={isRequired} 
				onFocus={() => setInfoName(true)}
				onBlur={() => setInfoName(false)}
			/>

			{infoName && <div>

				{row(NAME_REGEX_MINMAX, Name, `${NAME_MIN_CHARACTER} - ${NAME_MAX_CHARACTER} Zeichen`)}
				{row(NAME_REGEX_LETTERFIRST, Name, 'Angefangen mit Buchstaben')}
				{row(NAME_REGEX_ALLOWEDCHARS, Name, 'Buchstaben, Zahlen, Binde- oder Unterstriche')}

			</div>}



			<FancyInput 
				id='Password' 
				type='password' 
				classNames={`${Password && PASSWORD_REGEX.test(Password) ? 'green' : ''} ${Password && !PASSWORD_REGEX.test(Password) ? 'red' : ''}`} 
				text='Passwort' 
				value={Password} 
				setValue={setPassword} 
				isRequired={isRequired} 
				onFocus={() => setInfoName(false)}
				onBlur={() => setInfoName(true)}
			/>

			{!infoName && <div>

				{row(PASSWORD_REGEX_MINMAX, Password, `${PASSWORD_MIN_CHARACTER} - ${PASSWORD_MAX_CHARACTER} Zeichen`)}
				{row(PASSWORD_REGEX_ALLOWEDCHARS, Password, 'Kleinbuchstaben, Großuchstaben und Zahlen')}
				{row(PASSWORD_REGEX_ALLOWEDSYMBOLS, Password, 'Zeichen: ! @ # $ % - _')}

			</div>}

		</>
	)

}
