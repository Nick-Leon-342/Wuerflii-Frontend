

import './scss/Loader_Box.scss'





/**
 * 
 * Loader_Box component that displays a loading spinner with customizable styles.
 * It accepts className for additional styles and dark for a dark mode variant.
 *
 * @component
 * @example
 * // Example usage of Loader_Box component
 * <Loader_Box className="custom-class" dark={true} />
 *
 * @param {Object} props - The component props
 * @param {string} [props.className] - Optional additional CSS class names to customize the component
 * @param {boolean} [props.dark=false] - Boolean to apply dark mode styling to the loader
 *
 * @returns {JSX.Element} The rendered Loader_Box component
 * 
 */

export default function Loader_Box({
	className, 
	dark
}) {

	return <>
		<div className={`loader_box${className ? ` ${className}` : ''}${dark ? ' loader_box-dark' : ''}`}/>
	</>

}
