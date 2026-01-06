

import './scss/Custom_Link.scss'

import type { MouseEventHandler } from 'react'





interface Props__Custom_Link {
	text: 			string
	onClick: 		MouseEventHandler<HTMLButtonElement>
	textBefore?:	string
}

export default function Custom_Link({ 
	textBefore, 
	onClick, 
	text, 
}: Props__Custom_Link) {

	return <>
		<div className={`custom_link${textBefore && ' right'}`}>
			
			<label>{textBefore}</label>

			<button
				onClick={onClick}
			>{text}</button>

		</div>
	</>

}
