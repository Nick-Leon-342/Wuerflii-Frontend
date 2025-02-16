

import './scss/Close.scss'





/**
 * 
 * Close component that renders a close button (styled as a cross).
 * The button triggers the `onClick` function when clicked.
 *
 * @component
 * @example
 * // Example usage of Close component
 * <Close onClick={handleClose} />
 *
 * @param {Object} props - The component props
 * @param {Function} props.onClick - The function to be called when the close button is clicked
 *
 * @returns {JSX.Element} The rendered Close component with a button
 * 
 */

export default function Close({ onClick }) {
	
	return <>
		<div className='close-container'>
			<button
				onClick={onClick}
				className='button button-reverse button-responsive'
			><svg viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg></button>
		</div>
	</>

}
