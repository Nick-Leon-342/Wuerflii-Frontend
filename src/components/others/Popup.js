

import './scss/Popup.scss'

import { useEffect } from 'react'
import Close from '../NavigationElements/Close'





export default function Popup({ showPopup, setShowPopup, children, title }) {

	useEffect(() => {

		if(showPopup) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'visible'
		}

	}, [showPopup])

	const click = () => {

		setShowPopup(false)

	}





	return (
		<>
			<div 
				className={`popup_background ${showPopup ? 'show' : ''}`} 
				onClick={click}
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
	)

}
