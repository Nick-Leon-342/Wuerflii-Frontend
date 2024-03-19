

import './css/RegistrationForm.css'

import { useState } from 'react'
import { NAME_REGEX, NAME_REGEX_MINMAX, NAME_REGEX_LETTERFIRST, NAME_REGEX_ALLOWEDCHARS, PASSWORD_REGEX, PASSWORD_REGEX_MINMAX, PASSWORD_REGEX_ALLOWEDCHARS, PASSWORD_REGEX_ALLOWEDSYMBOLS, REACT_APP_USERNAME_MIN_CHARACTER, REACT_APP_USERNAME_MAX_CHARACTER, REACT_APP_PASSWORD_MIN_CHARACTER, REACT_APP_PASSWORD_MAX_CHARACTER } from "../logic/utils-env"
import FancyInput from './FancyInput'





export default function RegistrationForm({ Name, setName, Password, setPassword, isRequired }) {

	const [ infoName, setInfoName ] = useState(false)
	const [ infoPassword, setInfoPassword ] = useState(false)





	const getIcon = (valid) => {

		return valid ?
			<svg className='valid' viewBox='0 -960 960 960'><path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/></svg>
			:
			<svg className='invalid' viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
	
	}

	const row = (REGEX, Value, Text) => {
		
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

			{infoName && <>

				{row(NAME_REGEX_MINMAX, Name, `${REACT_APP_USERNAME_MIN_CHARACTER} - ${REACT_APP_USERNAME_MAX_CHARACTER} Zeichen`)}
				{row(NAME_REGEX_LETTERFIRST, Name, 'Angefangen mit Buchstaben')}
				{row(NAME_REGEX_ALLOWEDCHARS, Name, 'Buchstaben, Zahlen, Binde- oder Unterstriche')}

			</>}



			<FancyInput 
				id='Password' 
				type='password' 
				classNames={`registrationform_input ${Password && PASSWORD_REGEX.test(Password) ? 'green' : ''} ${Password && !PASSWORD_REGEX.test(Password) ? 'red' : ''}`} 
				text='Passwort' 
				value={Password} 
				setValue={setPassword} 
				isRequired={isRequired} 
				onFocus={() => setInfoPassword(true)}
				onBlur={() => setInfoPassword(false)}
			/>

			{infoPassword && <>

				{row(PASSWORD_REGEX_MINMAX, Password, `${REACT_APP_PASSWORD_MIN_CHARACTER} - ${REACT_APP_PASSWORD_MAX_CHARACTER} Zeichen`)}
				{row(PASSWORD_REGEX_ALLOWEDCHARS, Password, 'Kleinbuchstaben, Großuchstaben und Zahlen')}
				{row(PASSWORD_REGEX_ALLOWEDSYMBOLS, Password, 'Zeichen: ! @ # $ % - _')}

			</>}

		</>
	)

}
