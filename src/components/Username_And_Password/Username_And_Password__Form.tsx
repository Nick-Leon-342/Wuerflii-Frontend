

import { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Context__ENV_Variables from '@/Provider_And_Context/Provider_And_Context__ENV_Variables'

import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../ui/popover'
import Username_And_Password__Input from './Username_And_Password__Input'
import { Check, X } from 'lucide-react'





interface Props___Username_And_Password__Form {
	isRequired:				boolean
	setName?:				React.Dispatch<React.SetStateAction<string>>
	name?:					string
	setPassword?:			React.Dispatch<React.SetStateAction<string>>
	password?:				string
	setPassword_confirm?:	React.Dispatch<React.SetStateAction<string>>
	password_confirm?:		string
}

export default function Username_And_Password__Form({ 
	setName, 
	name, 

	setPassword, 
	password, 

	setPassword_confirm, 
	password_confirm, 
}: Props___Username_And_Password__Form) {

	const { t } = useTranslation()

	const { 
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
	} = useContext(Context__ENV_Variables)

	const [ info__name, 					setInfo__name					] = useState<boolean>(false)
	const [ info__password, 				setInfo__password				] = useState<boolean>(false)

	const [ show__popup_name, 				setShow__popup_name				] = useState<boolean>(false)
	const [ show__popup_password,			setShow__popup_password			] = useState<boolean>(false)





	useEffect(() => {
		function check_if_name_popup_should_be_shown() {
			if(name) setShow__popup_name(info__name && !new RegExp(NAME__REGEX).test(name))
		}
		check_if_name_popup_should_be_shown()
	}, [ info__name, NAME__REGEX, name ])

	useEffect(() => {
		function check_if_password_popup_should_be_shown() {
			if(password) setShow__popup_password(info__password && !new RegExp(PASSWORD__REGEX).test(password))
		}
		check_if_password_popup_should_be_shown()
	}, [ info__password, PASSWORD__REGEX, password ])





	return <>
		
		{/* __________________________________________________ name __________________________________________________ */}

		{name !== undefined && setName !== undefined && <>
			<Input_With_Popover
				setShow={setShow__popup_name}
				show={show__popup_name}
				placeholder='username'
				setValue={setName}
				value={name}
				type='text'

				onFocus={() => setInfo__name(true)}
				onBlur={() => setInfo__name(false)}

				is_invalid={Boolean(name && NAME__REGEX && !new RegExp(NAME__REGEX).test(name))}
				is_valid={Boolean(name && NAME__REGEX && new RegExp(NAME__REGEX).test(name))}
			>
				<ROW REGEX={NAME__REGEX_MINMAX} value={name} text={`${NAME__MIN_CHARACTER} - ${NAME__MAX_CHARACTER} ${t('auth.characters')}`}/>
				<ROW REGEX={NAME__REGEX_LETTERFIRST} value={name} text={t('auth.begins_with_letter')}/>
				<ROW REGEX={NAME__REGEX_ALLOWEDCHARS} value={name} text={t('auth.letters_numbers_hyphens_underscores')}/>
			</Input_With_Popover>
		</>}





		{/* __________________________________________________ password __________________________________________________ */}

		{password !== undefined && setPassword !== undefined && password_confirm !== undefined && setPassword_confirm !== undefined && <>

			<Input_With_Popover
				setShow={setShow__popup_password}
				show={show__popup_password}
				placeholder='auth.password'
				setValue={setPassword}
				value={password}
				type='password'

				onFocus={() => setInfo__password(true)}
				onBlur={() => setInfo__password(false)}

				is_invalid={Boolean(password && PASSWORD__REGEX && !new RegExp(PASSWORD__REGEX).test(password))}
				is_valid={Boolean(password && PASSWORD__REGEX && new RegExp(PASSWORD__REGEX).test(password))}
			>
				<ROW REGEX={PASSWORD__REGEX_MINMAX} value={password} text={`${PASSWORD__MIN_CHARACTER} - ${PASSWORD__MAX_CHARACTER} ${t('auth.characters')}`}/>
				<ROW REGEX={PASSWORD__REGEX_ALLOWEDSYMBOLS} value={password} text={`${t('auth.characters_special')}: ! @ # $ % - _`}/>
				<ROW REGEX={PASSWORD__REGEX_ALLOWEDCHARS} value={password} text={t('auth.characters_allowed')}/>
			</Input_With_Popover>



			{/* __________ confirm password __________ */}

			<Username_And_Password__Input
				placeholder='auth.password_confirm'
				setValue={setPassword_confirm}
				value={password_confirm}
				type='password'

				is_valid={Boolean(password && password === password_confirm)}
				is_invalid={Boolean(password && password_confirm && password !== password_confirm)}
			/>

		</>}

	</>
}





interface Props__Row {
	REGEX:	string
	value:	string
	text:	string
}

const ROW = ({ 
	REGEX, 
	value, 
	text 
}: Props__Row) => {

	if(!REGEX) return 
	
	return (
		<div className='flex flex-row gap-1 items-center [&_svg]:shrink-0'>
			{new RegExp(REGEX).test(value) ? <Check className='stroke-primary'/> : <X/>}
			<span className='text-lg'>{text}</span>
		</div>
	)

}





interface Props__Input_With_Popover {
	setShow:		React.Dispatch<React.SetStateAction<boolean>>
	show:			boolean

	placeholder:	string
	setValue:		React.Dispatch<React.SetStateAction<string>>
	value:			string
	type:			'text' | 'password'

	onFocus:		() => void
	onBlur:			() => void

	is_invalid:		boolean
	is_valid:		boolean

	children:		React.ReactNode
}

const Input_With_Popover = ({
	setShow, 
	show, 
	placeholder, 
	setValue, 
	value, 
	type, 
	
	onFocus, 
	onBlur, 

	is_invalid, 
	is_valid, 
	children, 
}: Props__Input_With_Popover) => {

	const ref = useRef<HTMLInputElement>(null)

	return <>
		<Popover 
			open={show} 
			onOpenChange={setShow}
		>
			<PopoverTrigger asChild><span className='absolute invisible' /></PopoverTrigger>

			<PopoverAnchor asChild>
				<Username_And_Password__Input
					placeholder={placeholder}
					setValue={setValue}
					value={value}
					type={type}

					ref={ref}
	
					onFocus={onFocus}
					onBlur={onBlur}
	
					is_invalid={is_invalid}
					is_valid={is_valid}
				/>
			</PopoverAnchor>

			<PopoverContent 
				onInteractOutside={e => { if(e.target === ref.current) e.preventDefault() }}
				className='w-(--radix-popper-anchor-width)!'
				onOpenAutoFocus={e => e.preventDefault()}
				align='center'
				side='bottom'
			>{children}</PopoverContent>
		</Popover>
	</>
}
