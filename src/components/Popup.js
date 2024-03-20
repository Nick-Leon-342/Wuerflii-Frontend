

import { useEffect } from 'react'
import Close from './NavigationElements/Close'
import './css/Popup.css'


export default function Popup({ showPopup, setShowPopup, children }) {

	useEffect(() => {

		if(showPopup) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'visible'
		}

	}, [showPopup])




	return (
		<>
			<div className={`popup_background ${showPopup ? 'show' : ''}`} onClick={() => setShowPopup(false)}/>

			<div className={`popup ${showPopup ? 'show' : ''}`}>

				<Close onClick={() => setShowPopup(false)}/>

				<div className='popup-grid'>
					<div className='popup-container'>
						{children}
					</div>
				</div>

			</div>
		</>
	)

}
