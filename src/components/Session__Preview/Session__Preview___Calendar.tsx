

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { de } from 'date-fns/locale'
import { format } from 'date-fns' 

import type { Type__Session_Date__PATCH } from '@/types/Zod__Session_Date'
import { patch__session_date } from '@/api/session/session'
import type { Type__Session } from '@/types/Zod__Session'
import useErrorHandling from '@/hooks/useErrorHandling'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
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

	const [ date, 			setDate			] = useState<Date | undefined>(new Date())
	const [ dialog_open, 	setDialog_open	] = useState<boolean>(false)

	useEffect(() => { 
		function init() { if(session) setDate(session.View__Custom_Date) } 
		init()
	}, [ session ])





	const mutate__custom_date = useMutation({
		mutationFn: (json: Type__Session_Date__PATCH) => patch__session_date(+(session?.id || -1), json), 
		onSuccess: (_, json) => {
			
			setSession(prev => {
				if(!prev) return prev
				const tmp = { ...prev }
				tmp.View__Custom_Date = json.View__Custom_Date
				query_client.setQueryData([ 'session', session?.id ], tmp)
				return tmp
			})
			toast.success(t('successfully.saved'))
			setDialog_open(false)
			
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

		mutate__custom_date.mutate({ View__Custom_Date: date || new Date(), })

	}





	return <>
		<Dialog open={dialog_open} onOpenChange={setDialog_open}>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					className='justify-between'
					onClick={() => setDialog_open(true)}
				>
					<span>{t('view_from')}:</span>
					<span className='text-secondary'>{`${format(new Date(session?.View__Custom_Date || ''), 'dd.MM.yyyy')}` || t('create_view')}</span>
				</Button>
			</DialogTrigger>

			<DialogContent showCloseButton={false}>

				<DialogHeader>
					<DialogTitle>{t('choose_beginning')}</DialogTitle>
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
						text={t('save')}
					/>
				</DialogFooter>

			</DialogContent>
		</Dialog>
	</>
}
