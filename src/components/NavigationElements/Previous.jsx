

import './scss/Previous.scss'





/**
 * 
 * A previous button component that triggers an onClick event and displays optional child elements.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.className] - An optional additional class name to style the previous button container.
 * @param {React.ReactNode} [props.children] - Optional child elements to display next to the button.
 * @param {function} props.onClick - The function to call when the button is clicked.
 *
 * @returns {JSX.Element} The rendered previous button element with optional children.
 * 
 */

export default function Previous({ 
	className, 
	children, 
	onClick, 
}) {

	return <>
		<div className={`previous${className ? ` ${className}` : ''}`}>

			<button
				onClick={onClick} 
				className='button button-reverse button-responsive' 
			><svg viewBox='0 -960 960 960'><path d='M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z'/></svg></button>

			{children}

		</div>
	</>

}
