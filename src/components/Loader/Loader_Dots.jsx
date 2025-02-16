

import './scss/Loader_Dots.scss'





export default function Loader_Dots({
	className
}) {

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
