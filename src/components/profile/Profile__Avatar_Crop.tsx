

import { useTranslation } from 'react-i18next'
import { useCallback, useState } from 'react'
import Cropper from 'react-easy-crop'

import { getCroppedImg } from '@/logic/utils'

import Custom_Button from '../misc/Custom_Button'
import { Button } from '../ui/button'
import { toast } from 'sonner'





interface Props___Profile__Avatar_Crop {
	setAvatar_cropped:	React.Dispatch<React.SetStateAction<Blob | null>>
	setShow_crop:		React.Dispatch<React.SetStateAction<boolean>>
	image:				string
}

export function Profile__Avatar_Crop({
	setAvatar_cropped, 
	setShow_crop, 
	image, 
}: Props___Profile__Avatar_Crop) {

	const { t } = useTranslation()

	const [ crop, 				setCrop					] = useState({ x: 0, y: 0 })
	const [ zoom, 				setZoom					] = useState(1)
	const [ croppedAreaPixels, 	setCroppedAreaPixels	] = useState(null)

	const [ loading, 			setLoading				] = useState<boolean>(false)





	const onCropComplete = useCallback((_: any, clippedPixels: any) => { // eslint-disable-line
		setCroppedAreaPixels(clippedPixels)
	}, [])

	async function crop_finished() {

		setLoading(true)

		try {
			const cropped_blob = await getCroppedImg(image, croppedAreaPixels)
			setAvatar_cropped(cropped_blob)
			setShow_crop(false)
		} catch(err) {
			console.log(err)
			toast.error(t('profile.error_while_cropping_avatar'))
		} finally {
			setLoading(false)
		}

	}





	return <>
		<div className='relative w-full h-100'>
			<Cropper
				image={image}
				aspect={1}
				showGrid={false}
				crop={crop}
				onCropChange={setCrop}
				zoom={zoom}
				onZoomChange={setZoom}
				onCropComplete={onCropComplete}
				cropShape='round'
			/>
		</div>

		<Custom_Button
			loading={loading}
			text={t('action.ok')}
			onClick={crop_finished}
		/>

		<Button
			variant='ghost'
			onClick={() => setShow_crop(false)}
		>{t('action.cancel')}</Button>
	</>
}
