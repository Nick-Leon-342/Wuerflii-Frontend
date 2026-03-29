

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import type { Type__Context__Error } from '@/types/Type__Context/Type__Context__Error'
import { XCircle } from 'lucide-react'





export default function Popup__Error({
	setError, 
	error, 
}: Type__Context__Error) {

	const { t } = useTranslation()

	const [ progress, 	setProgress		] = useState<number>(100)
	const [ isHovered, 	setIsHovered	] = useState<boolean>(false)
	const milliseconds = 5000





	useEffect(() => {

		if (!error) return

		setTimeout(() => setProgress(0), 50)
  
		// clear popup
		let timeout: ReturnType<typeof setTimeout> | undefined
		if(!isHovered) 
			timeout = setTimeout(() => setError(''), milliseconds)

		return () => {
			clearTimeout(timeout)
			setProgress(100)
		}

	}, [ error, setError, isHovered ])

	useEffect(() => { if(error) setTimeout(() => setProgress(isHovered ? 100 : 0) , 50) }, [ isHovered, error ])





	if(!error) return <></>

	return <>
		<div 
			className='flex fixed top-5 right-5 overflow-hidden rounded-lg shadow-2xl bg-background z-100'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div 
				onClick={() => setError('')}
				className='flex flex-col relative p-5 bg-[rgba(200,0,0,0.07)]'
			>

				<header className='flex gap-1.25 items-center mb-2.5'>
					<XCircle className='h-7.5a [&_path]:stroke-destructive [&_circle]:stroke-destructive'/>
					<span className='text-2xl font-semibold text-destructive'>{t('error.error')}</span>
				</header>

				<div>
					<p>{error}</p>
				</div>

				<div className='flex flex-col-reverse absolute bottom-0 left-0 w-1.25 h-full'>
					<div 
						className={`w-full bg-destructive transition-[height] ease-linear ${isHovered ? 'transition-none' : ''}`}
						style={{ height: `${progress}%`, transitionDuration: isHovered ? '0ms' : `${milliseconds}ms` }}
					/>
				</div>
				
			</div>
		</div>
	</>
}
