

import './scss/Input_Fancy.scss'

import { forwardRef, type FocusEvent, type ChangeEvent } from 'react'





interface Props__Input_Fancy {
	text: 			string
	id: 			string
	value: 			string | number
	onChange: 		(event: ChangeEvent<HTMLInputElement>) => void;

	type?:			'text'
	isRequired?: 	boolean
	className?: 	string
	maxLength?: 	number
	onFocus?: 		(event: FocusEvent<HTMLInputElement>) => void
	onBlur?: 		(event: FocusEvent<HTMLInputElement>) => void
	isGreen?: 		boolean
	isRed?:			boolean
}

const Input_Fancy = forwardRef<HTMLInputElement, Props__Input_Fancy>(({ 
	isRequired, 
	className,  
	maxLength, 
	onChange, 
	onFocus, 
	isGreen, 
	onBlur, 
	isRed, 
	value, 
	text, 
	type, 
	id, 
}, ref) => {
	
	return <>

		<div className={`input_fancy${isRed ? ' input_fancy_red' : ''}${isGreen ? ' input_fancy_green' : ''}${className ? ` ${className}` : ''}`}>

			<input
				id={id}
				ref={ref}
				type={type}
				value={value}
				placeholder=''
				onBlur={onBlur}
				onFocus={onFocus}
				autoComplete='off'
				onChange={onChange}
				required={isRequired}
				maxLength={maxLength}
			/>

			<label htmlFor={id}>{text}</label>

		</div>

	</>

})

export default Input_Fancy
