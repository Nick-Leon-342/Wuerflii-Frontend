

import './scss/Popup__Error.scss'

import { useEffect, useState } from 'react'

import type { Type__Context__Error } from '../../types/Type__Context/Type__Context__Error'





export default function Popup__Error({
	setError, 
	error, 
}: Type__Context__Error) {

	const [ progress, 	setProgress		] = useState<number>(100)
	const [ isHovered, 	setIsHovered	] = useState<boolean>(false)





	useEffect(() => {

		if (!error) return

		setTimeout(() => setProgress(0), 50)
  
		// clear popup
		let timeout: ReturnType<typeof setTimeout> | undefined
		if(!isHovered) 
			timeout = setTimeout(() => setError(''), 5000) // 5sec timer ( if you want to edit the timer you also have to edit the progress-transition time in scss )

		return () => {
			clearTimeout(timeout)
			setProgress(100)
		}

	}, [ error, setError, isHovered ])

	useEffect(() => { if(error) setTimeout(() => setProgress(isHovered ? 100 : 0) , 50) }, [ isHovered, error ])

	// useEffect(() => {
	// 	if(!error) return
	// 	setProgress(0)
	// 	// setIsHovered(true)
	// 	// setTimeout(() => setIsHovered(false), 10)
	// }, [ error ])





	if(!error) return <></>

	return <>
		<div 
			className='popup__error'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className='popup__error-container'>

				<header>
					<svg viewBox='0 -960 960 960'><path d='m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'/></svg>
					<span>Fehler</span>
				</header>

				<div>
					<p>{error}</p>
				</div>

				<div className='popup__error_progress_bar'>
					<div 
						className={`popup__error_progress${isHovered ? ' instant' : ''}`}
						style={{ height: `${progress}%` }}
					/>
				</div>
				
			</div>
		</div>
	</>
}
