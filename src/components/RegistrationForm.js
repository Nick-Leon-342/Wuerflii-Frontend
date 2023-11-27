

import { useState } from "react"
import { NAME_REGEX, NAME_REGEX_MINMAX, NAME_REGEX_LETTERFIRST, NAME_REGEX_ALLOWEDCHARS, PASSWORD_REGEX, PASSWORD_REGEX_MINMAX, PASSWORD_REGEX_ALLOWEDCHARS, PASSWORD_REGEX_ALLOWEDSYMBOLS, REACT_APP_USERNAME_MIN_CHARACTER, REACT_APP_USERNAME_MAX_CHARACTER, REACT_APP_PASSWORD_MIN_CHARACTER, REACT_APP_PASSWORD_MAX_CHARACTER } from "../logic/utils-env"
import FancyInput from "./FancyInput"




export default function RegistrationForm({ Name, setName, Password, setPassword, isRequired }) {

	const [ infoName, setInfoName ] = useState(true)
	const textColor = 'var(--text-color-light)'

	const getIcon = (correct) => {

		return correct ?
			<svg height='25' viewBox='0 -960 960 960' style={{ marginRight: '10px', fill: 'rgb(0, 255, 0)' }}><path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/></svg>
			:
			<svg height='25' viewBox='0 -960 960 960' style={{ marginRight: '10px', fill: textColor }}><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
	
	}

	const row = (REGEX, Value, Text) => {
		
		return (
			<div style={{ display: 'flex', height: '25px', padding: '0' }}>
				{getIcon(REGEX.test(Value))}
				<label style={{ padding: '3px 0', fontSize: '18px', color: textColor }}>{Text}</label>
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

			<FancyInput 
				id='Password' 
				type='password' 
				marginTop='15px'
				classNames={`${Password && PASSWORD_REGEX.test(Password) ? 'green' : ''} ${Password && !PASSWORD_REGEX.test(Password) ? 'red' : ''}`} 
				text='Passwort' 
				value={Password} 
				setValue={setPassword} 
				isRequired={isRequired} 
			/>
				
			<div style={{ height: '100px', textAlign: 'left' }}>

			<div style={{ fontSize: '18px', paddingBottom: '4px', color: textColor }}>{infoName ? 'Benutzername:' : 'Passwort:'}</div>

			{infoName ? <>

				{row(NAME_REGEX_MINMAX, Name, `${REACT_APP_USERNAME_MIN_CHARACTER} - ${REACT_APP_USERNAME_MAX_CHARACTER} Zeichen`)}
				{row(NAME_REGEX_LETTERFIRST, Name, 'Angefangen mit Buchstaben')}
				{row(NAME_REGEX_ALLOWEDCHARS, Name, 'Buchstaben, Zahlen, Binde- oder Unterstriche')}

			</> : <>

				{row(PASSWORD_REGEX_MINMAX, Password, `${REACT_APP_PASSWORD_MIN_CHARACTER} - ${REACT_APP_PASSWORD_MAX_CHARACTER} Zeichen`)}
				{row(PASSWORD_REGEX_ALLOWEDCHARS, Password, 'Kleinbuchstaben, Großuchstaben und Zahlen')}
				{row(PASSWORD_REGEX_ALLOWEDSYMBOLS, Password, 'Zeichen: ! @ # $ % - _')}

			</>}

			</div>

		</>

	)

}
