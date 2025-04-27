

import './scss/RegistrationForm.scss'

import { useEffect, useRef, useState } from 'react'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

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
 *   setNAME_REGEX={setNAME_REGEX}
 *   setPASSWORD_REGEX={setPASSWORD_REGEX}
 *   PASSWORD_REGEX={PASSWORD_REGEX}
 *   NAME_REGEX={NAME_REGEX}
 *   isRequired={true}
 *   setRequesting_regex={setRequesting_regex}
 *   requesting_regex={requesting_regex}
 *   setName={setName}
 *   Name={Name}
 *   setPassword={setPassword}
 *   Password={Password}
 * />
 *
 * @param {Object} props - The component props
 * @param {Function} props.setNAME_REGEX - Function to update the regex for the username validation
 * @param {RegExp} props.NAME_REGEX - Regular expression for validating the username
 * @param {Function} props.setPASSWORD_REGEX - Function to update the regex for the password validation
 * @param {RegExp} props.PASSWORD_REGEX - Regular expression for validating the password
 * @param {boolean} props.isRequired - If true, the input fields will be required
 * @param {Function} props.setRequesting_regex - Function to set the loading state for regex fetching
 * @param {boolean} props.requesting_regex - State to indicate if regex data is being fetched
 * @param {Function} props.setName - Function to update the name input value
 * @param {string} props.Name - The current name input value
 * @param {Function} props.setPassword - Function to update the password input value
 * @param {string} props.Password - The current password input value
 *
 * @returns {JSX.Element} The rendered RegistrationForm component
 * 
 */

export default function RegistrationForm({ 
	setPASSWORD_REGEX, 
	PASSWORD_REGEX, 
	setNAME_REGEX, 
	NAME_REGEX, 
	isRequired, 

	setRequesting_regex, 
	requesting_regex, 

	setName, 
	Name, 

	setPassword, 
	Password, 
}) {

	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const ref_name = useRef()
	const ref_password = useRef()

	const [ infoName, setInfoName ] = useState(false)
	const [ infoPassword, setInfoPassword ] = useState(false)
	const [ show_popup_name, setShow_popup_name ] = useState(false)
	const [ show_popup_password, setShow_popup_password ] = useState(false)

	
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

		}).catch((err) => {

			handle_error({
				err
			})

		}).finally(() => setRequesting_regex(false))

		// eslint-disable-next-line
	}, [])

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
