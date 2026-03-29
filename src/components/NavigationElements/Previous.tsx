

import './scss/Previous.scss'

import type { MouseEventHandler, ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'





interface Props__Previous {
	children?: 	ReactNode
	onClick?: 	MouseEventHandler<HTMLButtonElement>
	className?: string
}

export default function Previous({ 
	className, 
	children, 
	onClick, 
}: Props__Previous) {

	return <>
		<div className={`previous${className ? ` ${className}` : ''}`}>

			<button
				onClick={onClick} 
				className='button button_reverse button_scale_3 previous--button' 
			><ChevronLeft/></button>

			{children}

		</div>
	</>

}
