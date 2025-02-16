

import './scss/Popup_Error.scss'

import { useEffect, useState } from 'react'





/**
 * 
 * Popup_Edit_View Component
 *
 * This component provides a popup interface for editing and selecting different views.
 *
 * @param {Object} props - Component properties
 * @param {React.RefObject} props.target_ref - Reference to the target element
 * @param {Function} props.setShow_customDate - Function to show the custom date selection
 * @param {Function} props.setShow_popup - Function to toggle the popup visibility
 * @param {boolean} props.show_popup - Controls the visibility of the popup
 * @param {Function} props.setSession - Function to update the session state
 * @param {Object} props.session - Current session data
 * 
 */

export default function Popup_Error({
	className, 
	setError, 
	error, 
}) {

	const [ progress, setProgress ] = useState(100)
	const [ isHovered, setIsHovered ] = useState(false)





	useEffect(() => {

		if (!error) return

		setTimeout(() => setProgress(0), 50)
  
		// clear popup
		let timeout
		if(!isHovered) 
			timeout = setTimeout(() => setError(), 5000) // 5sec timer ( if you want to edit the timer you also have to edit the progress-transition time in scss )

		return () => {
			clearTimeout(timeout)
			setProgress(100)
		}

	}, [ error, setError, isHovered ])

	useEffect(() => {
		if(error) setTimeout(() => setProgress(isHovered ? 100 : 0) , 50)
	}, [ isHovered, error ])

	useEffect(() => {
		setIsHovered(true)
		setTimeout(() => setIsHovered(false), 10)
	}, [ error ])





	if(!error) return <></>

	return <>
		<div 
			className={`popup_error${className ? ` ${className}` : ''}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className='popup_error-container'>
				<header>
					<svg viewBox='0 -960 960 960'><path d='m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'/></svg>
					<span>Fehler</span>
				</header>
				<div>
					<p>{error}</p>
				</div>
				<div className='popup_error_progress_bar'>
					<div 
						className={`popup_error_progress${isHovered ? ' instant' : ''}`}
						style={{ height: `${progress}%` }}
					/>
				</div>
			</div>
		</div>
	</>
}
