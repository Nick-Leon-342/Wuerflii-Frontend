

import './scss/Accordion.scss'

import { useEffect, useRef, useState } from 'react'





/**
 * 
 * An accordion component that expands or collapses to show or hide its content.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.className] - An optional additional class name to style the accordion.
 * @param {React.ReactNode} props.children - The content to display inside the accordion when expanded.
 * @param {string} props.title - The title of the accordion, displayed in the header.
 *
 * @returns {JSX.Element} The rendered accordion component.
 * 
 */

export default function Accordion({ 
	className, 
	children, 
	title, 
}) {

	const ref = useRef()
	const [ selected, setSelected ] = useState(true)





	// useEffect(() => {

	// 	// Set popup-children non-focusable with tab when popup isn't visible
	// 	const focusableElements = ref.current.querySelectorAll(
	// 		'a, button, input, select, textarea, [tabindex]'
	// 	)
	
	// 	focusableElements.forEach(el => {
	// 		if(selected) el.setAttribute('tabindex', '-1')
	// 		if(!selected) el.setAttribute('tabindex', '0')
	// 	})

	// }, [ children, selected ])





	return <>
		<div className={`accordion${selected ? ` selected` : ``}${className ? ` ${className}` : ''}`}>

			<div 
				className='accordion_header'
				onClick={(e) => {
					e.stopPropagation()
					setSelected(prev => !prev)
				}}
			>
				<h3>{title}</h3>
				<button>
					<svg viewBox='0 -960 960 960'><path d='M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z'/></svg>
				</button>
			</div>



			<div ref={ref} className='body'>
				{children}
			</div>

		</div>
	</>
}
