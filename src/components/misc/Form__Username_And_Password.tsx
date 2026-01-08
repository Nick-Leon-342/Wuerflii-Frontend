

import './scss/Form__Username_And_Password.scss'

import { useContext, useEffect, useRef, useState } from 'react'

import Context__Regex from '../../Provider_And_Context/Provider_And_Context__Regex'

import InputWithSVG from './Input_With_SVG'

import Key from '../../svg/Key.svg?react'
import Person from '../../svg/Person.svg?react'
import Popup__Dropdown from '../Popup/Popup__Dropdown'





interface Props__Form__Username_And_Password {
	isRequired:				boolean
	setName:				React.Dispatch<React.SetStateAction<string>>
	name:					string
	setPassword:			React.Dispatch<React.SetStateAction<string>>
	password:				string
	setPassword_confirm?:	React.Dispatch<React.SetStateAction<string>>
	password_confirm?:		string
}

export default function Form__Username_And_Password({ 
	isRequired, 

	setName, 
	name, 

	setPassword, 
	password, 

	setPassword_confirm, 
	password_confirm, 
}: Props__Form__Username_And_Password) {

	const ref__name = useRef<HTMLInputElement>(null)
	const ref__password = useRef<HTMLInputElement>(null)
	const ref__password_confirm = useRef<HTMLInputElement>(null)

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
	} = useContext(Context__Regex)





	useEffect(() => {
		function check_if_name_popup_should_be_shown() {
			setShow__popup_name(info__name && !requesting_regex && !NAME_REGEX?.test(name))
		}
		check_if_name_popup_should_be_shown()
	}, [ info__name, requesting_regex, NAME_REGEX, name ])
	useEffect(() => {
		function check_if_password_popup_should_be_shown() {
			setShow__popup_password(info__password && !requesting_regex && !PASSWORD_REGEX?.test(password))
		}
		check_if_password_popup_should_be_shown()
	}, [ info__password, requesting_regex, PASSWORD_REGEX, password ])





	return <>
		
		{/* __________________________________________________ name __________________________________________________ */}

		<>
			<InputWithSVG
				type='text'
				value={name}
				ref={ref__name}
				SVG={<Person/>}
				isRequired={isRequired}
				name='Benutzername'
				onValueChange={({ target }) => setName(target.value)}

				onFocus={() => setInfo__name(true)}
				onBlur={() => setInfo__name(false)}

				isValid={Boolean(name && NAME_REGEX && NAME_REGEX.test(name))}
				isInvalid={Boolean(name && NAME_REGEX && !NAME_REGEX.test(name))}
			/>

			<Popup__Dropdown
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
			</Popup__Dropdown>
		</>





		{/* __________________________________________________ password __________________________________________________ */}

		<>
			<InputWithSVG
				SVG={<Key/>}
				type='password'
				name='Passwort'
				value={password}
				isRequired={isRequired}
				ref={ref__password}
				onValueChange={({ target }) => setPassword(target.value)}

				onFocus={() => setInfo__password(true)}
				onBlur={() => setInfo__password(false)}

				isValid={Boolean(password && PASSWORD_REGEX && PASSWORD_REGEX.test(password))}
				isInvalid={Boolean(password && PASSWORD_REGEX && !PASSWORD_REGEX.test(password))}
			/>

			<Popup__Dropdown
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
			</Popup__Dropdown>
		</>





		{/* __________________________________________________ confirm password __________________________________________________ */}

		{password_confirm && setPassword_confirm &&  <>
			<InputWithSVG
				SVG={<Key/>}
				type='password'
				isRequired={isRequired}
				value={password_confirm}
				name='Passwort bestätigen'
				ref={ref__password_confirm}
				onValueChange={({ target }) => setPassword_confirm(target.value)}

				isValid={Boolean(password && password === password_confirm)}
				isInvalid={Boolean(password && password_confirm && password !== password_confirm)}
			/>
		</>}

	</>
}

interface Props__Row {
	REGEX:		RegExp
	value:		string
	text:		string
}

const ROW = ({ REGEX, value, text }: Props__Row) => {

	const getIcon = ( valid: boolean ) => {

		return valid ?
			<svg className='valid' viewBox='0 -960 960 960'><path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/></svg>
			:
			<svg viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
	
	}

	if(!REGEX) return 
	
	return (
		<div>
			{getIcon(REGEX.test(value))}
			<label>{text}</label>
		</div>
	)

}
