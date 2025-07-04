

import './scss/Previous.scss'

import { ReactComponent as ArrowBack } from '../../svg/Arrow_Back.svg'





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
				className='button button_reverse button_scale_3 previous-button' 
			><ArrowBack/></button>

			{children}

		</div>
	</>

}
