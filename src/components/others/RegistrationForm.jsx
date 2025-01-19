

import './scss/RegistrationForm.scss'

import { useEffect, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import FancyInput from './FancyInput'
import Loader from '../Loader/Loader'
import useErrorHandling from '../../hooks/useErrorHandling'





export default function RegistrationForm({ 
	setName, 
	Name, 

	setPassword, 
	Password, 

	isRequired, 
	NAME_REGEX, 
	setNAME_REGEX, 
	PASSWORD_REGEX, 
	setPASSWORD_REGEX 
}) {

	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()
	const [ requesting, setRequesting ] = useState(false)

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

		setRequesting(true)

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

		}).finally(() => { setRequesting(false) })

		// eslint-disable-next-line
	}, [])

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
		
		<FancyInput 
			value={Name} 
			type='text' 
			id='Username' 
			setValue={setName} 
			text='Benutzername' 
			isRequired={isRequired} 
			onFocus={() => setInfoName(true)}
			onBlur={() => setInfoName(false)}
			isRed={Name && NAME_REGEX && !NAME_REGEX.test(Name)}
			isGreen={Name && NAME_REGEX && NAME_REGEX.test(Name)}
		/>

		{infoName && requesting && <Loader loading={true}/>}

		{infoName && !requesting && !NAME_REGEX?.test(Name) && <>
			
			<div className='registrationform_error'>

				<ROW REGEX={NAME_REGEX_MINMAX} value={Name} text={`${NAME_MIN_CHARACTER} - ${NAME_MAX_CHARACTER} Zeichen`}/>
				<ROW REGEX={NAME_REGEX_LETTERFIRST} value={Name} text={'Angefangen mit Buchstaben'}/>
				<ROW REGEX={NAME_REGEX_ALLOWEDCHARS} value={Name} text={'Buchstaben, Zahlen, Binde- oder Unterstriche'}/>

			</div>

		</>}



		<FancyInput 
			id='Password' 
			type='password' 
			text='Passwort' 
			value={Password} 
			setValue={setPassword} 
			isRequired={isRequired} 
			onBlur={() => setInfoName(true)}
			onFocus={() => setInfoName(false)}
			isRed={Password && PASSWORD_REGEX && !PASSWORD_REGEX.test(Password)}
			isGreen={Password && PASSWORD_REGEX && PASSWORD_REGEX.test(Password)}
		/>

		{!infoName && requesting && <Loader loading={requesting}/>}
			
		{!infoName && !requesting && !PASSWORD_REGEX?.test(Password) && <>
			
			<div className='registrationform_error'>

				<ROW REGEX={PASSWORD_REGEX_MINMAX} value={Password} text={`${PASSWORD_MIN_CHARACTER} - ${PASSWORD_MAX_CHARACTER} Zeichen`}/>
				<ROW REGEX={PASSWORD_REGEX_ALLOWEDSYMBOLS} value={Password} text={'Zeichen: ! @ # $ % - _'}/>
				<ROW REGEX={PASSWORD_REGEX_ALLOWEDCHARS} value={Password} text={'Kleinbuchstaben, Großuchstaben und Zahlen'}/>

			</div>

		</>}

	</>
}
