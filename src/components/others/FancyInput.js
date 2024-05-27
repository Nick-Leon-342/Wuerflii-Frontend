

import './scss/FancyInput.scss'





export default function FancyInput({ id, type, text, value, setValue, isRequired, onFocus, onBlur, maxLength }) {

	return (

		<div className='fancyinput'>

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
