

import './scss/FancyInput.scss'

import React, { forwardRef } from 'react'




const FancyInput = forwardRef(({ 
	isRequired, 
	className,  
	maxLength, 
	setValue, 
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

		<div className={`fancyinput${isRed ? ' fancyinput_red' : ''}${isGreen ? ' fancyinput_green' : ''}${className ? ` ${className}` : ''}`}>

			<input
				id={id}
				ref={ref}
				type={type}
				value={value}
				placeholder=''
				onBlur={onBlur}
				onFocus={onFocus}
				autoComplete='off'
				required={isRequired}
				maxLength={maxLength}
				onChange={({ target }) => setValue(target.value)}
			/>

			<label htmlFor={id}>{text}</label>

		</div>

	</>

})

export default FancyInput
