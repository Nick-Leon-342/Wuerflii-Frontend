

import './scss/Input_With_SVG.scss'

import { forwardRef, type FocusEvent, type ChangeEvent, type ReactNode } from 'react'





interface Props__Input_With_SVG {
	name:						string
	type?:						'text' | 'password'
	value:						string | number
	onValueChange:				(event: ChangeEvent<HTMLInputElement>) => void

	SVG?:						ReactNode
	list__possible_entries?:	Array<number>
	className?:				string
	step?:						number

	onFocus?:					(event: FocusEvent<HTMLInputElement>) => void
	onBlur?:					(event: FocusEvent<HTMLInputElement>) => void

	isRequired?: 				boolean
	isInvalid?: 				boolean
	isValid?: 					boolean
}

const Input_With_SVG = forwardRef<HTMLInputElement, Props__Input_With_SVG>(({
	list__possible_entries, 
	onValueChange, 
	className, 
	value, 
	type, 
	name, 
	step,
	SVG, 

	onFocus, 
	onBlur, 

	isRequired, 

	isInvalid,
	isValid, 
}, ref) => {
	return <>
		<div className={`input_with_svg--container${isValid ? ' valid' : ''}${isInvalid ? ' invalid' : ''}${className ? ' ' + className : ''}`}>
			{SVG}

			<input
				ref={ref}
				step={step}
				type={type}
				value={value}
				onBlur={onBlur}
				onFocus={onFocus}
				placeholder={name}
				list={`${name}-list`}
				required={isRequired}
				onChange={onValueChange}
			/>
			{list__possible_entries && <>
				<datalist id={`${name}-list`}>
					{list__possible_entries.map(e => (
						<option key={e} value={e}/>
					))}
				</datalist>
			</>}
		</div>
	</>
})

export default Input_With_SVG
