

import './scss/Loader_Dots.scss'





/**
 * 
 * Loader_Dots component that displays a series of dots as a loading indicator.
 * It accepts className for additional styles.
 *
 * @component
 * @example
 * // Example usage of Loader_Dots component
 * <Loader_Dots className="custom-class" />
 *
 * @param {Object} props - The component props
 * @param {string} [props.className] - Optional additional CSS class names to customize the component
 *
 * @returns {JSX.Element} The rendered Loader_Dots component with animated dots
 * 
 */

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
