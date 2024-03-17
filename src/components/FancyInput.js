

import './css/FancyInput.css'





export default function FancyInput({ id, type, classNames, text, value, setValue, isRequired, onFocus, onBlur, maxLength }) {

	return (

		<div className={`fancyinput ${classNames ? classNames : ''}`}>

			<input
				id={id}
				type={type}
				autoComplete='off'
				onChange={({ target }) => setValue(target.value)}
				value={value}
				maxLength={maxLength}
				placeholder=''
				required={isRequired}
				onFocus={onFocus}
				onBlur={onBlur}
			/>

			<label htmlFor={id}>{text}</label>

		</div>

	)

}
