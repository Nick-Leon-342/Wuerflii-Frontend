

import './scss/Form__Username_And_Password.scss'

import { useContext, useEffect, useRef, useState } from 'react'

import { RegexContext } from '../../context/Regex'

import InputWithSVG from './Input_With_SVG'
import PopupDropdown from '../Popup/Popup_Dropdown'

import { ReactComponent as Key } from '../../svg/Key.svg'
import { ReactComponent as Person } from '../../svg/Person.svg'





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
 *   name={name}
 *   setPassword={setPassword}
 *   password={password}
 * />
 *
 * @param {Object} props - The component props
 * @param {boolean} props.isRequired - If true, the input fields will be required
 * @param {Function} props.setName - Function to update the name input value
 * @param {string} props.name - The current name input value
 * @param {Function} props.setPassword - Function to update the password input value
 * @param {string} props.password - The current password input value
 *
 * @returns {JSX.Element} The rendered RegistrationForm component
 * 
 */

export default function Form__Username_And_Password({ 
	isRequired, 

	setName, 
	name, 

	setPassword, 
	password, 

	setPassword_confirm, 
	password_confirm, 
}) {

	const ref__name = useRef()
	const ref__password = useRef()
	const ref__password_confirm = useRef()

	const [ info__name, 					setInfo__name					] = useState(false)
	const [ info__password, 				setInfo__password				] = useState(false)

	const [ show__popup_name, 				setShow__popup_name				] = useState(false)
	const [ show__popup_password,			setShow__popup_password			] = useState(false)
 
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





	useEffect(() => setShow__popup_name(info__name && !requesting_regex && !NAME_REGEX?.test(name)), [ info__name, requesting_regex, NAME_REGEX, name ])
	useEffect(() => setShow__popup_password(info__password && !requesting_regex && !PASSWORD_REGEX?.test(password)), [ info__password, requesting_regex, PASSWORD_REGEX, password ])

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
		
		{/* __________________________________________________ name __________________________________________________ */}

		<>
			<InputWithSVG
				type='text'
				value={name}
				ref={ref__name}
				SVG={<Person/>}
				isRequired={true}
				name='Benutzername'
				onValueChange={({ target }) => setName(target.value)}

				onFocus={() => setInfo__name(true)}
				onBlur={() => setInfo__name(false)}

				isValid={name && NAME_REGEX && NAME_REGEX.test(name)}
				isInvalid={name && NAME_REGEX && !NAME_REGEX.test(name)}
			/>

			<PopupDropdown
				alignLeft={true}
				target_ref={ref__name}
				widthSameAsTarget={true}
				show_popup={show__popup_name}
				setShow_popup={setShow__popup_name}
			>
				<div className='form__username_and_password--popup'>

					<ROW REGEX={NAME_REGEX_MINMAX} value={name} text={`${NAME_MIN_CHARACTER} - ${NAME_MAX_CHARACTER} Zeichen`}/>
					<ROW REGEX={NAME_REGEX_LETTERFIRST} value={name} text={'Angefangen mit Buchstaben'}/>
					<ROW REGEX={NAME_REGEX_ALLOWEDCHARS} value={name} text={'Buchstaben, Zahlen, Binde- oder Unterstriche'}/>

				</div>
			</PopupDropdown>
		</>





		{/* __________________________________________________ password __________________________________________________ */}

		<>
			<InputWithSVG
				SVG={<Key/>}
				type='password'
				name='Passwort'
				value={password}
				isRequired={true}
				ref={ref__password}
				onValueChange={({ target }) => setPassword(target.value)}

				onFocus={() => setInfo__password(true)}
				onBlur={() => setInfo__password(false)}

				isValid={password && PASSWORD_REGEX && PASSWORD_REGEX.test(password)}
				isInvalid={password && PASSWORD_REGEX && !PASSWORD_REGEX.test(password)}
			/>

			<PopupDropdown
				widthSameAsTarget={true}
				target_ref={ref__password}
				show_popup={show__popup_password}
				setShow_popup={setShow__popup_password}
			>
				<div className='form__username_and_password--popup'>

					<ROW REGEX={PASSWORD_REGEX_MINMAX} value={password} text={`${PASSWORD_MIN_CHARACTER} - ${PASSWORD_MAX_CHARACTER} Zeichen`}/>
					<ROW REGEX={PASSWORD_REGEX_ALLOWEDSYMBOLS} value={password} text={'Zeichen: ! @ # $ % - _'}/>
					<ROW REGEX={PASSWORD_REGEX_ALLOWEDCHARS} value={password} text={'Kleinbuchstaben, Großuchstaben und Zahlen'}/>

				</div>
			</PopupDropdown>
		</>





		{/* __________________________________________________ confirm password __________________________________________________ */}

		<>
			<InputWithSVG
				SVG={<Key/>}
				type='password'
				isRequired={true}
				value={password_confirm}
				name='Passwort bestätigen'
				ref={ref__password_confirm}
				onValueChange={({ target }) => setPassword_confirm(target.value)}

				isValid={password && password === password_confirm}
				isInvalid={password && password_confirm && password !== password_confirm}
			/>
		</>

	</>
}
