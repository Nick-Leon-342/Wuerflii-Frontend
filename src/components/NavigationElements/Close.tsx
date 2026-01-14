

import './scss/Close.scss'

import type { MouseEventHandler } from 'react'





interface Props__Close {
	onClick: 		MouseEventHandler<HTMLButtonElement>
}

export default function Close({
	onClick
}: Props__Close) {
	
	return <>
		<div className='close--container'>
			<button
				onClick={onClick}
				className='button button-reverse button-responsive'
			>
				<svg viewBox='0 -960 960 960'><path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/></svg>
			</button>
		</div>
	</>

}
