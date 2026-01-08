

import './scss/Previous.scss'

import ArrowBack from '../../svg/Arrow_Back.svg?react'

import type { MouseEventHandler, ReactNode } from 'react'





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
				className='button button_reverse button_scale_3 previous-button' 
			><ArrowBack/></button>

			{children}

		</div>
	</>

}
