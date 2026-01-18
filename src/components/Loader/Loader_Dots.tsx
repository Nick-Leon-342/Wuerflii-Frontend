

import './scss/Loader_Dots.scss'





interface Props__Loader_Dots {
	className?:	string
}

export default function Loader_Dots({
	className, 
}: Props__Loader_Dots) {

	return <>
		<div className={`loader_dots${className ? ` ${className}` : ''}`}>
			<div className='loader_dots__dot'/>
			<div className='loader_dots__dot'/>
			<div className='loader_dots__dot'/>
			<div className='loader_dots__dot'/>
			<div className='loader_dots__dot'/>
			<div className='loader_dots__dot'/>
			<div className='loader_dots__dot'/>
			<div className='loader_dots__dot'/>
		</div>
	</>
	
}
