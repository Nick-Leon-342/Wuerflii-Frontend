

import './scss/Popup.scss'

import { useEffect } from 'react'
import Close from '../NavigationElements/Close'





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
