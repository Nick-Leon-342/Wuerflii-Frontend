

import './scss/FancyInput.scss'





export default function FancyInput({ 
	id, 
	type, 
	text, 
	value, 
	isRed, 
	onBlur, 
	isGreen, 
	onFocus, 
	setValue, 
	maxLength, 
	className,  
	isRequired, 
}) {

	return <>

		<div className={`fancyinput${isRed ? ' fancyinput_red' : ''}${isGreen ? ' fancyinput_green' : ''}${className ? ` ${className}` : ''}`}>

			<input
				id={id}
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

}
