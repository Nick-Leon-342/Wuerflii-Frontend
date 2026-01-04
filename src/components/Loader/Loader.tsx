

import './scss/Loader.scss'





/**
 * 
 * A loader component that displays a loading animation when the loading state is true.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.className] - An optional additional class name to style the loader.
 * @param {boolean} props.loading - A boolean indicating whether the loader should be displayed.
 *
 * @returns {JSX.Element|null} The rendered loader element or null if not loading.
 * 
 */

export default function Loader({ 
	className, 
	loading, 
}) {

	return <>
		{loading && 
			<div className={`loader${className ? ` ${className}` : ''}`}>
				<span/>
				<span/>
				<span/>
			</div>
		}
	</>

}
