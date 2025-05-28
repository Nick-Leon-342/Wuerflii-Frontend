

import './scss/RegistrationForm.scss'

import { useContext, useEffect, useRef, useState } from 'react'

import { RegexContext } from '../../context/Regex'

import FancyInput from './FancyInput'
import PopupDropdown from '../Popup/Popup_Dropdown'





/**
 * 
 * RegistrationForm component handles the registration process, including username
 * and password validation based on custom regular expressions. It displays input fields
 * for username and password with live validation feedback, showing errors when the 
 * user input doesn't match the required patterns.
 *
 * @component
 * @example
 * // Example usage of RegistrationForm component
 * <RegistrationForm
 *   isRequired={true}
 *   setName={setName}
 *   Name={Name}
 *   setPassword={setPassword}
 *   Password={Password}
 * />
 *
 * @param {Object} props - The component props
 * @param {boolean} props.isRequired - If true, the input fields will be required
 * @param {Function} props.setName - Function to update the name input value
 * @param {string} props.Name - The current name input value
 * @param {Function} props.setPassword - Function to update the password input value
 * @param {string} props.Password - The current password input value
 *
 * @returns {JSX.Element} The rendered RegistrationForm component
 * 
 */

export default function RegistrationForm({ 
	isRequired, 

	setName, 
	Name, 

	setPassword, 
	Password, 
}) {

	const ref_name = useRef()
	const ref_password = useRef()

	const [ infoName, setInfoName ] = useState(false)
	const [ infoPassword, setInfoPassword ] = useState(false)
	const [ show_popup_name, setShow_popup_name ] = useState(false)
	const [ show_popup_password, setShow_popup_password ] = useState(false)

	const {
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
	} = useContext(RegexContext)





	useEffect(() => setShow_popup_name(infoName && !requesting_regex && !NAME_REGEX?.test(Name)), [ infoName, requesting_regex, NAME_REGEX, Name ])
	useEffect(() => setShow_popup_password(infoPassword && !requesting_regex && !PASSWORD_REGEX?.test(Password)), [ infoPassword, requesting_regex, PASSWORD_REGEX, Password ])

	const getIcon = ( valid ) => {

		return valid ?
			<svg className='valid' viewBox='0 -960 960 960'><path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/></svg>
			:
			<svg viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
	
	}

	const ROW = ({ REGEX, value, text }) => {

		if(!REGEX) return 
		
		return (
			<div>
				{getIcon(REGEX.test(value))}
				<label>{text}</label>
			</div>
		)

	}





	return <>
		
		{/* __________________________________________________ Name __________________________________________________ */}

		<FancyInput 
			value={Name} 
			type='text' 
			id='Username' 
			ref={ref_name}
			text='Benutzername' 
			isRequired={isRequired} 
			onFocus={() => setInfoName(true)}
			onBlur={() => setInfoName(false)}
			onChange={({ target }) => setName(target.value)} 
			isRed={Name && NAME_REGEX && !NAME_REGEX.test(Name)}
			isGreen={Name && NAME_REGEX && NAME_REGEX.test(Name)}
		/>

		<PopupDropdown
			alignLeft={true}
			target_ref={ref_name}
			widthSameAsTarget={true}
			show_popup={show_popup_name}
			setShow_popup={setShow_popup_name}
		>
			<div className='registrationform_error'>

				<ROW REGEX={NAME_REGEX_MINMAX} value={Name} text={`${NAME_MIN_CHARACTER} - ${NAME_MAX_CHARACTER} Zeichen`}/>
				<ROW REGEX={NAME_REGEX_LETTERFIRST} value={Name} text={'Angefangen mit Buchstaben'}/>
				<ROW REGEX={NAME_REGEX_ALLOWEDCHARS} value={Name} text={'Buchstaben, Zahlen, Binde- oder Unterstriche'}/>

			</div>
		</PopupDropdown>





		{/* __________________________________________________ Password __________________________________________________ */}

		<FancyInput 
			id='Password' 
			type='password' 
			text='Passwort' 
			value={Password} 
			ref={ref_password}
			isRequired={isRequired} 
			onBlur={() => setInfoPassword(false)}
			onFocus={() => setInfoPassword(true)}
			onChange={({ target }) => setPassword(target.value)} 
			isRed={Password && PASSWORD_REGEX && !PASSWORD_REGEX.test(Password)}
			isGreen={Password && PASSWORD_REGEX && PASSWORD_REGEX.test(Password)}
		/>

		<PopupDropdown
			widthSameAsTarget={true}
			target_ref={ref_password}
			show_popup={show_popup_password}
			setShow_popup={setShow_popup_password}
		>
			<div className='registrationform_error'>

				<ROW REGEX={PASSWORD_REGEX_MINMAX} value={Password} text={`${PASSWORD_MIN_CHARACTER} - ${PASSWORD_MAX_CHARACTER} Zeichen`}/>
				<ROW REGEX={PASSWORD_REGEX_ALLOWEDSYMBOLS} value={Password} text={'Zeichen: ! @ # $ % - _'}/>
				<ROW REGEX={PASSWORD_REGEX_ALLOWEDCHARS} value={Password} text={'Kleinbuchstaben, Großuchstaben und Zahlen'}/>

			</div>
		</PopupDropdown>

	</>
}
