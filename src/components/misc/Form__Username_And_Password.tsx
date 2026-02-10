

import './scss/Form__Username_And_Password.scss'

import { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
	setPassword_confirm:	React.Dispatch<React.SetStateAction<string>>
	password_confirm:		string
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

	const { t } = useTranslation()

	const ref__name = useRef<HTMLInputElement>(null)
	const ref__password = useRef<HTMLInputElement>(null)
	const ref__password_confirm = useRef<HTMLInputElement>(null)

	const [ info__name, 					setInfo__name					] = useState(false)
	const [ info__password, 				setInfo__password				] = useState(false)

	const [ show__popup_name, 				setShow__popup_name				] = useState(false)
	const [ show__popup_password,			setShow__popup_password			] = useState(false)
 
	const {
		requesting_regex, 

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
	} = useContext(Context__Regex)





	useEffect(() => {
		function check_if_name_popup_should_be_shown() {
			setShow__popup_name(info__name && !requesting_regex && !NAME__REGEX?.test(name))
		}
		check_if_name_popup_should_be_shown()
	}, [ info__name, requesting_regex, NAME__REGEX, name ])

	useEffect(() => {
		function check_if_password_popup_should_be_shown() {
			setShow__popup_password(info__password && !requesting_regex && !PASSWORD__REGEX?.test(password))
		}
		check_if_password_popup_should_be_shown()
	}, [ info__password, requesting_regex, PASSWORD__REGEX, password ])





	return <>
		
		{/* __________________________________________________ name __________________________________________________ */}

		<>
			<InputWithSVG
				type='text'
				value={name}
				ref={ref__name}
				SVG={<Person/>}
				isRequired={isRequired}
				name={t('username')}
				onValueChange={({ target }) => setName(target.value)}

				onFocus={() => setInfo__name(true)}
				onBlur={() => setInfo__name(false)}

				isValid={Boolean(name && NAME__REGEX && NAME__REGEX.test(name))}
				isInvalid={Boolean(name && NAME__REGEX && !NAME__REGEX.test(name))}
			/>

			<Popup__Dropdown
				alignLeft={true}
				target_ref={ref__name}
				widthSameAsTarget={true}
				show_popup={show__popup_name}
				setShow_popup={setShow__popup_name}
			>
				<div className='form__username_and_password--popup'>

					<ROW REGEX={NAME__REGEX_MINMAX} value={name} text={`${NAME__MIN_CHARACTER} - ${NAME__MAX_CHARACTER} ${t('characters')}`}/>
					<ROW REGEX={NAME__REGEX_LETTERFIRST} value={name} text={t('begins_with_letter')}/>
					<ROW REGEX={NAME__REGEX_ALLOWEDCHARS} value={name} text={t('letters_numbers_hyphens_underscores')}/>

				</div>
			</Popup__Dropdown>
		</>





		{/* __________________________________________________ password __________________________________________________ */}

		<>
			<InputWithSVG
				SVG={<Key/>}
				type='password'
				value={password}
				ref={ref__password}
				name={t('password')}
				isRequired={isRequired}
				onValueChange={({ target }) => setPassword(target.value)}

				onFocus={() => setInfo__password(true)}
				onBlur={() => setInfo__password(false)}

				isValid={Boolean(password && PASSWORD__REGEX && PASSWORD__REGEX.test(password))}
				isInvalid={Boolean(password && PASSWORD__REGEX && !PASSWORD__REGEX.test(password))}
			/>

			<Popup__Dropdown
				widthSameAsTarget={true}
				target_ref={ref__password}
				show_popup={show__popup_password}
				setShow_popup={setShow__popup_password}
			>
				<div className='form__username_and_password--popup'>

					<ROW REGEX={PASSWORD__REGEX_MINMAX} value={password} text={`${PASSWORD__MIN_CHARACTER} - ${PASSWORD__MAX_CHARACTER} ${t('characters')}`}/>
					<ROW REGEX={PASSWORD__REGEX_ALLOWEDSYMBOLS} value={password} text={`${t('characters_special')}: ! @ # $ % - _`}/>
					<ROW REGEX={PASSWORD__REGEX_ALLOWEDCHARS} value={password} text={t('characters_allowed')}/>

				</div>
			</Popup__Dropdown>
		</>





		{/* __________________________________________________ confirm password __________________________________________________ */}

		<InputWithSVG
			SVG={<Key/>}
			type='password'
			isRequired={isRequired}
			value={password_confirm}
			ref={ref__password_confirm}
			name={t('password_confirm')}
			onValueChange={({ target }) => setPassword_confirm(target.value)}

			isValid={Boolean(password && password === password_confirm)}
			isInvalid={Boolean(password && password_confirm && password !== password_confirm)}
		/>

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
