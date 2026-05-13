

import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'

import useErrorHandling from '@/hooks/useErrorHandling'
import { post__avatar } from '@/api/avatar'
import { useUser } from '@/hooks/useUser'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Profile__Avatar_Crop } from './Profile__Avatar_Crop'
import { Avatar, AvatarImage } from '../ui/avatar'
import Custom_Button from '../misc/Custom_Button'
import Profile__Avatar from './Profile__Avatar'
import { ArrowBigDown } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { toast } from 'sonner'





export default function Profile__Avatar_Edit() {

	const { setUser }	= useUser()
	const { t }			= useTranslation()
	const handle_error	= useErrorHandling()
	const ref_input		= useRef<HTMLInputElement>(null)

	const [ avatar, 			setAvatar				] = useState<File | null>(null)
	const [ avatar_cropped, 	setAvatar_cropped		] = useState<Blob | null>(null)
	const [ preview_url, 		setPreview_url			] = useState<string | null>(null)
	const [ show_cropping, 		setShow_cropping		] = useState<boolean>(false)
	const [ loading, 			setLoading				] = useState<boolean>(false)
	const [ successfully_saved,	setSuccessfully_saved	] = useState<boolean>(false)





	function handle_file_change(e: React.ChangeEvent<HTMLInputElement>) {
		const selected_file = e.target.files?.[0]
		if(selected_file) {
			setAvatar(selected_file)
			setPreview_url(URL.createObjectURL(selected_file))
			setShow_cropping(true)
		}
	}

	function upload_avatar() {

		if(!avatar_cropped) return 

		setLoading(true)

		const formData = new FormData()
		formData.append('avatar', avatar_cropped)

		post__avatar(formData).then(url => {

			setAvatar(null)
			setAvatar_cropped(null)
			setUser(prev => {
				if(!prev) return prev
				return { ...prev, Avatar: url }
			})
			setTimeout(() => setSuccessfully_saved(true), 10)

		}).catch(err => {
			handle_error({
				err, 
				handle_413: () => {
					toast.error(t('profile.avatar_too_large'))
				}
			})
		}).finally(() => setLoading(false))

	}

	useEffect(() => {
		function reset() { setSuccessfully_saved(false) }
		reset()
	}, [ avatar ])





	return <>
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='ghost'
					className='relative justify-between! w-full items-center'
				>
					<span>{t('profile.avatar')}</span>

					<Profile__Avatar className='absolute w-20 h-20 bottom-0 right-0'/>
				</Button>
			</DialogTrigger>



			<DialogContent showCloseButton={false}>

				<DialogHeader>
					<DialogTitle>
						{t('profile.avatar')}
					</DialogTitle>
				</DialogHeader>



				{show_cropping && preview_url ? <>
					<Profile__Avatar_Crop
						setAvatar_cropped={setAvatar_cropped}
						setShow_crop={setShow_cropping}
						image={preview_url}
					/>
				</> : <>
					<Button 
						variant='ghost'
						onClick={() => ref_input.current?.click()}
						className='flex flex-col items-center gap-1 h-fit'
					>
						<Profile__Avatar className={`h-fit ${avatar ? 'w-20' : 'w-full'}`}/>

						{avatar_cropped && <>
							<ArrowBigDown className='stroke-primary'/>

							<Avatar className='w-full h-fit'>
								<AvatarImage src={URL.createObjectURL(avatar_cropped)}/>
							</Avatar>
						</>}
					</Button>

					<Input
						type='file'
						ref={ref_input}
						className='hidden'
						onChange={handle_file_change}
						accept='image/jpeg, image/jpg, image/png'
					/>

					<DialogFooter>
						<Custom_Button
							ok={successfully_saved}
							onClick={upload_avatar}
							text={t('action.save')}
							disabled={!avatar}
							loading={loading}
						/>
					</DialogFooter>
				</>}

			</DialogContent>
		</Dialog>
	</>
}
