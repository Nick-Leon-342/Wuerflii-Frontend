

import './scss/Popup.scss'

import { useEffect } from 'react'

import Close from '../NavigationElements/Close'





/**
 * 
 * Popup component that displays a modal with customizable content and a close button.
 * It accepts props to control visibility, content, and styling.
 *
 * @component
 * @example
 * // Example usage of Popup component
 * <Popup showPopup={showPopup} setShowPopup={setShowPopup} title="Popup Title">
 *   <p>Popup Content</p>
 * </Popup>
 *
 * @param {Object} props - The component props
 * @param {string} [props.className] - Optional custom class name for additional styling
 * @param {boolean} props.showPopup - Boolean value to control the visibility of the popup
 * @param {Function} props.setShowPopup - Function to set the visibility of the popup
 * @param {React.ReactNode} props.children - The content to be displayed inside the popup
 * @param {string} props.title - The title to be displayed at the top of the popup
 *
 * @returns {JSX.Element} The rendered Popup component
 * 
 */

export default function Popup({ className, showPopup, setShowPopup, children, title }) {

	useEffect(() => { document.body.style.overflow = showPopup ? 'hidden' : 'visible' }, [showPopup])

	return <>
		<div 
			className={`popup_background${showPopup ? ' show' : ''}${className ? ` ${className}` : ''}`} 
			onClick={() => setShowPopup(false)}
		>
			<div className='popup' onClick={(e) => e.stopPropagation()}>

				<Close onClick={() => setShowPopup(false)}/>

				<h1>{title}</h1>

				<div className='popup-grid'>
					<div className='popup-container'>
						{children}
					</div>
				</div>

			</div>
		</div>
	</>
}
