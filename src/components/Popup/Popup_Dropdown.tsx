

import './scss/Popup_Dropdown.scss'

import { useEffect, useRef, useState } from 'react'





/**
 * 
 * Popup_Dropdown Component
 *
 * This component renders a dropdown popup positioned relative to a target element.
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Content inside the popup
 * @param {React.RefObject} props.target_ref - Reference to the target element
 * @param {boolean} props.show_popup - Controls the visibility of the popup
 * @param {Function} props.setShow_popup - Function to toggle popup visibility
 * @param {string} [props.className] - Additional CSS classes for the popup
 * @param {boolean} [props.alignLeft] - If true, aligns the popup to the left of the target
 * @param {boolean} [props.widthSameAsTarget] - If true, sets the popup width equal to the target element
 * @param {boolean} [props.removePopupFromDOM] - If true, removes the popup from the DOM when not visible
 * @param {number} [props.move_x] - X-axis offset for the popup position
 * @param {number} [props.move_y] - Y-axis offset for the popup position
 * 
 */

export default function Popup_Dropdown({ 
	children, 
	target_ref, 
	show_popup, 
	setShow_popup, 
	className, 
	alignLeft, 
	widthSameAsTarget, 
	removePopupFromDOM,	
	
	move_x, 
	move_y, 
}) {

	const popup_ref = useRef(null)
	const [ popup_position, setPopup_position ] = useState({ top: 0 })
	const [ popup_width, setPopup_width ] = useState()




	useEffect(() => {

		function handler(e) { if(!target_ref?.current?.contains(e.target) && !popup_ref?.current?.contains(e.target)) setShow_popup(false) }
		document.addEventListener('mousedown', handler)
		
		return () => document.removeEventListener('mousedown', handler)

	}, [ setShow_popup, target_ref ])	

	useEffect(() => {

		if(!show_popup) return 

		function updatePosition() {
			if (target_ref?.current && popup_ref?.current) {
				const targetRect = target_ref.current.getBoundingClientRect()
				const popupRect = popup_ref.current.getBoundingClientRect()
				const windowHeight = window.innerHeight
	
				let leftPosition = targetRect.left + window.scrollX
				if (!alignLeft) leftPosition = targetRect.right + window.scrollX - popupRect.width
	
				let topPosition = targetRect.bottom + window.scrollY + (move_y || 10)
	
				// Check if the popup overflows the window height and adjust the position
				if (topPosition + popupRect.height > windowHeight) topPosition = targetRect.top + window.scrollY - popupRect.height - (move_y || 10)
	
				// Ensure the popup doesn't go above the window's top edge
				if (topPosition < 0) topPosition = 0
	
				setPopup_position({
					top: topPosition,
					left: leftPosition + (move_x || 0),
				})
	
				if (widthSameAsTarget) {
					setPopup_width(targetRect.width)
				} else {
					setPopup_width(null)
				}
			}
		}

		updatePosition()
		window.addEventListener('resize', updatePosition)
		return () => window.removeEventListener('resize', updatePosition)
		
	}, [ target_ref, alignLeft, widthSameAsTarget, move_x, move_y, show_popup, children ])

	useEffect(() => {

		// Set popup-children non-focusable with tab when popup isn't visible
		const focusableElements = popup_ref.current.querySelectorAll(
			'a, button, input, select, textarea, [tabindex]'
		)
	
		focusableElements.forEach(el => {
			if(!show_popup) el.setAttribute('tabindex', '-1')
			if(show_popup) el.setAttribute('tabindex', '0')
		})

	}, [ children, show_popup ])




	return <>
		<div
			ref={popup_ref}
			className={`popup_dropdown${show_popup ? ' popup_dropdown_show' : ''}${className ? ` ${className}` : ''}`}
			style={{
				display: `${removePopupFromDOM ? (show_popup ? 'flex' : 'none') : 'flex'}`,
				top: `${popup_position.top}px`,
				left: `${popup_position.left}px`,
				width: popup_width ? `${popup_width}px` : 'auto',
			}}
		>
			<div className='popup_dropdown_container'>
				{children}
			</div>
		</div>
	</>
}
