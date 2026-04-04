

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { de } from 'date-fns/locale'
import { format } from 'date-fns' 

import type { Type__Client_To_Server__Session_Date__PATCH } from '@/types/Type__Client_To_Server/Type__Client_To_Server__Session_Date__PATCH'
import { patch__session_date } from '@/api/session/session'
import type { Type__Session } from '@/types/Type__Session'
import useErrorHandling from '@/hooks/useErrorHandling'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '../ui/dialog'
import Custom_Button from '../misc/Custom_Button'
import { Calendar } from '../ui/calendar'
import { Button } from '../ui/button'
import { toast } from 'sonner'





interface Props___Session__Preview___Calendar {
	setSession:	React.Dispatch<React.SetStateAction<Type__Session | undefined>>
	session?:	Type__Session
}

export default function Session__Preview___Calendar({
	setSession, 
	session, 
}: Props___Session__Preview___Calendar) {

	const { t } = useTranslation()
	const navigate		= useNavigate()
	const query_client	= useQueryClient()
	const handle_error	= useErrorHandling()

	const [ date,				setDate					] = useState<Date | undefined>(new Date())
	const [ successfully_saved, setSuccessfully_saved	] = useState<boolean>(false)

	useEffect(() => { 
		function init() {if(session) setDate(session.View__Custom_Date)} 
		init()
	}, [ session ])

	useEffect(() => { 
		function reset() { setSuccessfully_saved(false) }
		reset()
	}, [ date ])





	const mutate__custom_date = useMutation({
		mutationFn: (json: Type__Client_To_Server__Session_Date__PATCH) => patch__session_date(json), 
		onSuccess: (_, json) => {
			
			setSession(prev => {
				if(!prev) return prev
				const tmp = { ...prev }
				tmp.View__Custom_Date = json.View__Custom_Date
				query_client.setQueryData([ 'session', session?.id ], tmp)
				return tmp
			})
			setSuccessfully_saved(true)
			
			// Invalidate Query so that final_scores are being refetched
			query_client.invalidateQueries({ queryKey: [ 'session', +(session?.id || -1), 'finalscores' ] })

		}, 
		onError: err => {
			handle_error({
				err, 
				handle_404: () => {
					toast.error(t('session_not_found'))
					navigate('/', { replace: true })
				}
			})
		}
	})

	const save_customDate = () => {

		mutate__custom_date.mutate({ 
			View__Custom_Date: 	date || new Date(), 
			SessionID: 			session?.id || -1, 
		})

	}





	return <>
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					className='justify-baseline'
				>
					<span>{t('view_from')}:</span>
					<span className='text-secondary'>{`${format(new Date(session?.View__Custom_Date || ''), 'dd.MM.yyyy')}` || t('create_view')}</span>
				</Button>
			</DialogTrigger>

			<DialogContent showCloseButton={false}>

				<DialogHeader>
					<DialogTrigger>{t('choose_beginning')}</DialogTrigger>
				</DialogHeader>

				<Calendar
					captionLayout='dropdown'
					onSelect={setDate}
					className='w-full'
					selected={date}
					mode='single'
					locale={de}
				/>

				<DialogFooter>
					<Custom_Button
						loading={mutate__custom_date.isPending}
						onClick={save_customDate}
						ok={successfully_saved}
						text={t('save')}
					/>
				</DialogFooter>

			</DialogContent>
		</Dialog>
	</>
}
