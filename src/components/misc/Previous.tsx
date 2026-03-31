

import type { MouseEventHandler, ReactNode } from 'react'

import { ChevronLeft } from 'lucide-react'
import { Button } from '../ui/button'





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
		<div className={`flex flex-row items-center justify-between${className ? ` ${className}` : ''}`}>

			<Button
				onClick={onClick} 
				variant='outline'
				className='w-10 h-10' 
			><ChevronLeft className='w-8! h-8!'/></Button>

			{children}

		</div>
	</>

}
