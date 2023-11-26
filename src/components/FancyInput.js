

export default function FancyInput({ id, type, classNames, text, value, setValue, isRequired, onFocus, onBlur, maxLength, marginBottom, marginTop }) {

	const className= classNames ? `inputfield ${classNames}` : 'inputfield'





	return (

		<div className={ className } style={{ marginBottom: marginBottom, marginTop: marginTop }}>

			<input
				id={id}
				type={type}
				autoComplete='off'
				onChange={(e) => setValue(e.target.value)}
				value={value}
				maxLength={maxLength}
				placeholder=""
				required={isRequired}
				onFocus={onFocus}
				onBlur={onBlur}
			/>

			<label htmlFor={id}>{text}</label>

		</div>

	)

}
