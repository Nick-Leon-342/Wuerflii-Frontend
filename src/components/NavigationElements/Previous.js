

import './scss/Previous.scss'




export default function Previous({ onClick, children, className }) {

	return (
		<div className={`previous${className ? ' ' + className : ''}`}>

			<svg 
				onClick={onClick} 
				className='button-responsive' 
				viewBox='0 -960 960 960'
			><path d='M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z'/></svg>

			{children}

		</div>
	)

}
