

import './scss/FancyInput.scss'

import React, { forwardRef } from 'react'





/**
 * 
 * FancyInput component is a customizable input field with support for different styles
 * and validation states (required, green/red highlight). It includes a label and 
 * handles focus, blur, and change events.
 *
 * @component
 * @example
 * // Example usage of FancyInput component
 * <FancyInput
 *   isRequired={true}
 *   className="custom-class"
 *   maxLength={50}
 *   setValue={setValue}
 *   onFocus={handleFocus}
 *   onBlur={handleBlur}
 *   isGreen={true}
 *   isRed={false}
 *   value={inputValue}
 *   text="Enter your name"
 *   type="text"
 *   id="nameInput"
 * />
 *
 * @param {Object} props - The component props
 * @param {boolean} props.isRequired - If true, the input will be marked as required
 * @param {string} [props.className] - Additional CSS class names to apply
 * @param {number} [props.maxLength] - Maximum length of the input value
 * @param {Function} props.setValue - Function to update the value of the input
 * @param {Function} [props.onFocus] - Function to be called when the input is focused
 * @param {boolean} [props.isGreen] - If true, the input will have a green background
 * @param {Function} [props.onBlur] - Function to be called when the input loses focus
 * @param {boolean} [props.isRed] - If true, the input will have a red background
 * @param {string} props.value - The current value of the input field
 * @param {string} props.text - The label text for the input field
 * @param {string} props.type - The type of the input (e.g., text, password)
 * @param {string} props.id - The id of the input element (used for labeling)
 *
 * @returns {JSX.Element} The rendered FancyInput component
 * 
 */

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
