

import './scss/CustomLink.scss'





/**
 * 
 * CustomLink component that displays a button with optional text before it.
 * The button triggers the `onClick` function when clicked.
 *
 * @component
 * @example
 * // Example usage of CustomLink component
 * <CustomLink textBefore="Click to" text="Submit" onClick={handleSubmit} />
 *
 * @param {Object} props - The component props
 * @param {string} [props.textBefore] - Optional text displayed before the button
 * @param {Function} props.onClick - The function to be called when the button is clicked
 * @param {string} props.text - The text displayed on the button
 *
 * @returns {JSX.Element} The rendered CustomLink component with a label and button
 * 
 */

export default function CustomLink({ 
	textBefore, 
	onClick, 
	text, 
}) {

	return <>
		<div className={`customlink ${textBefore && 'right'}`}>
			
			<label>{textBefore}</label>

			<button
				onClick={onClick}
			>{text}</button>

		</div>
	</>

}
