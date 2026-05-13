

import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import { Zod__User_PATCH, type Type__User_PATCH } from '@/types/Zod__User'
import useErrorHandling from '@/hooks/useErrorHandling'
import { useUser } from '@/hooks/useUser'
import { patch__user } from '@/api/user'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import Username_And_Password__Form from '../Username_And_Password/Username_And_Password__Form'
import Custom_Button from '../misc/Custom_Button'
import { Button } from '../ui/button'
import { Edit } from 'lucide-react'
import { toast } from 'sonner'





export default function Profile__Password() {

	const { 
		user, 
		setUser, 
	} = useUser()

	const { t } 		= useTranslation()
	const handle_error	= useErrorHandling()

	const [ password, 			setPassword				] = useState<string>('')
	const [ password__confirm,	setPassword__confirm	] = useState<string>('')
	const [ successfully_saved, setSuccessfully_saved	] = useState<boolean>(false)





	const mutate__user = useMutation({
		mutationFn: (json: Type__User_PATCH) => patch__user(json), 
		onSuccess: (_, json) => {
			if(!user) return
			setUser(prev => {
				if(!prev || !json.Name) return prev
				const tmp = { ...prev }
				if(json.Name) tmp.Name = json.Name
				return tmp
			})
			toast.success(t('successfully.saved'))
			setSuccessfully_saved(true)
		}, 
		onError: err => {
			handle_error({
				err,
				handle_409: () => toast.error(t('auth.username_taken'))
			})
		}
	})

	useEffect(() => {
		function reset() { setSuccessfully_saved(false) }
		reset()
	}, [ password, password__confirm ])

	function save() {

		// Check if passwords match
		if(!password) return
		if(password !== password__confirm) return toast.error(t('error.password_confirm_doesnt_match'))
		

		// Check if name and/or password are valid
		const zod_result = Zod__User_PATCH.safeParse({ Password: password })
		if(!zod_result.success) return toast.error(t('auth.please_fill_out_registration'))
		const json_user = zod_result.data


		// Send user to backend
		mutate__user.mutate(json_user)

	}





	return <>
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='ghost'
					className='justify-between! w-full items-center'
				>
					<span>{t('auth.password')}</span>
					<div className='flex flex-row items-center gap-2'>
						<span>******</span>
						<Edit/>
					</div>
				</Button>
			</DialogTrigger>

			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>{t('auth.password')}</DialogTitle>
				</DialogHeader>

				<Username_And_Password__Form
					setPassword_confirm={setPassword__confirm}
					password_confirm={password__confirm}
					setPassword={setPassword}
					password={password}
					isRequired={false}
				/>

				<DialogFooter>
					<Custom_Button
						loading={mutate__user.isPending}
						ok={successfully_saved}
						text={t('action.edit')}
						onClick={save}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</>
}
