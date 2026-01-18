

import './scss/Popup.scss'

import { useEffect, type ReactNode } from 'react'





interface Props__Popup {
	setShow_popup:	React.Dispatch<React.SetStateAction<boolean>>
	show_popup:		boolean
	className?:		string
	children:		ReactNode
	title:			string
}

export default function Popup({ 
	setShow_popup, 
	show_popup, 
	className, 
	children, 
	title, 
}: Props__Popup) {

	useEffect(() => { document.body.style.overflow = show_popup ? 'hidden' : 'visible' }, [ show_popup ])

	return <>
		<div 
			className={`popup-background${show_popup ? ' popup-background_show' : ''}${className ? ` ${className}` : ''}`} 
			onClick={() => setShow_popup(false)}
		>
			<div className='popup' onClick={(e) => e.stopPropagation()}>

				<h1>{title}</h1>

				<div className='popup-container'>
					{children}
				</div>

			</div>
		</div>
	</>
}
