

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import { get__avatar } from '@/api/avatar'
import { useUser } from '@/hooks/useUser'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { toast } from 'sonner'





interface Props___Profile__Avatar {
	className?: string
}

export default function Profile__Avatar({
	className
}: Props___Profile__Avatar) {

	const { user } 	= useUser()
	const { t }		= useTranslation()

	const [ src, setSrc ] = useState<string>('')





	useEffect(() => {
		
		if(!user?.Avatar) return

		let object_url: string

		async function fetch_avatar() {
			try {
				if(!user) return
				const res = await get__avatar()
				const blob = await res.data
				object_url = URL.createObjectURL(blob)
				setSrc(object_url)
			} catch(err) {
				console.error(err)
				toast.error(t('error.fetching_avatar'))
			}
		}
		fetch_avatar()

		return () => { if(object_url) URL.revokeObjectURL(object_url) }

	}, [ user?.Avatar ])





	return <>
		<Avatar className={className}>
			<AvatarImage src={src} className='object-cover'/>
			<AvatarFallback className='text-xl font-bold'>{user?.Name.charAt(0).toUpperCase()}</AvatarFallback>
		</Avatar>
	</>
}
