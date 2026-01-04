

import './scss/Input_With_SVG.scss'

import { forwardRef } from 'react'





const Input_With_SVG = forwardRef(({
	list__possible_entries, 
	onValueChange, 
	classNames, 
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
		<div className={`input_with_svg--container${isValid ? ' valid' : ''}${isInvalid ? ' invalid' : ''}${classNames ? ' ' + classNames : ''}`}>
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
				isRequired={isRequired}
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
