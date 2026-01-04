

import './scss/ErrorMessage.scss'





/**
 * 
 * ErrorMessage component displays an error message when one is passed in.
 * It shows an error icon, title, and the message content.
 *
 * @component
 * @example
 * // Example usage of ErrorMessage component
 * <ErrorMessage error="An error occurred while fetching data" />
 *
 * @param {Object} props - The component props
 * @param {string} props.error - The error message to display
 *
 * @returns {JSX.Element|null} The rendered ErrorMessage component or null if no error is provided
 * 
 */

export default function ErrorMessage({ 
	error 
}) {

	return <>
		{error && <>
			<div className='errormessage'>

				<div className='errormessage_header'>
					<svg viewBox='0 -960 960 960'><path d='M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'/></svg>
					<h2>Fehler</h2>
				</div>

				<span className='errormessage_body'>{error}</span>
					
			</div>
		</>}
	</>

}
