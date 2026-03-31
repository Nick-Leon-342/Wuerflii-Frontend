

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import type { Type__Client_To_Server__Session__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session__PATCH'
import type { Enum__Input_Type } from '../../types/Enum/Enum__Input_Type'
import type { Type__Session } from '../../types/Type__Session'
import useErrorHandling from '../../hooks/useErrorHandling'
import { patch__session } from '../../api/session/session'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Settings, Square, SquareCheck, UserCog } from 'lucide-react'
import Custom_Button from '../misc/Custom_Button'
import { Spinner } from '../ui/spinner'
import { Button } from '../ui/button'





interface Props__Game_Options {
	setShow_surrender:	React.Dispatch<React.SetStateAction<boolean>>
	session?:			Type__Session
}

export default function Game_Options({
	setShow_surrender, 
	session, 
}: Props__Game_Options) {

	const navigate = useNavigate()
	const { t } = useTranslation()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ loading_newGame, setLoading_newGame ] = useState(false)

	const list__input_type: Array<Enum__Input_Type> = [
		'SELECT', 
		'SELECT_AND_TYPE', 
		'TYPE', 
	]





	// ____________________ Input Type ____________________

	const mutate__input_type = useMutation({
		mutationFn: (json: Type__Client_To_Server__Session__PATCH) => patch__session(axiosPrivate, json), 
		onSuccess: (_, json) => {
			if(!session) return
			query_client.setQueryData([ 'session', session.id ], (prev: Type__Session) => {
				if(!prev) return prev
				const tmp = { ...prev }
				tmp.Input_Type = json.Input_Type || 'SELECT'
				return tmp
			})
		}
	})

	function change__input_type(input_type: Enum__Input_Type) {

		if(!session) return
		const json = {
			SessionID:	session.id, 
			Input_Type: input_type
		}
		mutate__input_type.mutate(json)

	}


	// ____________________ Scores Visible ____________________

	const mutate__show_scores = useMutation({
		mutationFn: (json: Type__Client_To_Server__Session__PATCH) => patch__session(axiosPrivate, json), 
		onSuccess: (_, json) => {
			if(!session) return
			query_client.setQueryData([ 'session', session.id ], (prev: Type__Session) => {
				if(!prev) return prev
				const tmp = { ...prev }
				tmp.Show_Scores = Boolean(json.Show_Scores)
				return tmp
			})
		}
	})

	function change__scores_visible(): void {

		if(!session) return
		const json = {
			SessionID:		session.id, 
			Show_Scores:	!session.Show_Scores
		}
		mutate__show_scores.mutate(json)

	}


	// ____________________ New Game ____________________

	function new_game(): void {

		if(!session) return
		if(!window.confirm(t('sure_you_want_to_delete_this_game'))) return 
		setLoading_newGame(true)
	
		axiosPrivate.delete(`/game?session_id=${session.id}`).then(() => {

			query_client.removeQueries({ queryKey: [ 'session', session.id, 'table_columns' ] })
			navigate('/', { replace: true })

		}).catch((err) => {

			handle_error({ 
				err 
			})

		}).finally(() =>  setLoading_newGame(false))
	
	}





	return <>
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					className='w-10 h-10'
				><Settings className='w-8! h-8!'/></Button>
			</DialogTrigger>



			<DialogContent showCloseButton={false}>

				<DialogHeader>
					<DialogTitle>{t('settings')}</DialogTitle>
				</DialogHeader>



				<div className='flex flex-col gap-4'>

					{/* ____________________ Input_Type ____________________ */}

					<Select
						onValueChange={(value) => change__input_type(value as Enum__Input_Type)}
						disabled={mutate__input_type.isPending}
						value={session?.Input_Type}
					>
						<SelectTrigger>
							<SelectValue/>
						</SelectTrigger>

						<SelectContent>
							<SelectGroup>
								<SelectLabel>{t('input_type.name')}</SelectLabel>
								{list__input_type.map(input_type => (
									<SelectItem
										key={input_type}
										value={input_type}
										className='text-lg cursor-pointer'
									>{t('input_type.' + input_type)}</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>



					{/* ____________________ Show_Scores ____________________ */}

					<Button
						disabled={mutate__show_scores.isPending}
						onClick={change__scores_visible}
						className='justify-between'
						variant='outline'
					>
						<span>{t('show_scores')}</span>
						{mutate__show_scores.isPending && <Spinner/>}
						{!mutate__show_scores.isPending && (session?.Show_Scores
							? <SquareCheck/>
							: <Square/>
						)}
					</Button>



					{/* ____________________ Edit ____________________ */}

					<Button
						variant='outline'
						className='justify-between'
						onClick={() => navigate(`/session/${session?.id}/players`)}
					>
						<span>{t('edit_players')}</span>
						<UserCog/>
					</Button>

				</div>



				<DialogFooter>

					{/* ____________________ Surrender ____________________ */}

					<Button
						variant='destructive'
						onClick={() => setShow_surrender(true)}
					>{t('surrender')}</Button>



					{/* ____________________ New Game ____________________ */}

					<Custom_Button 
						loading={loading_newGame}
						text={t('discard_game')}
						variant='destructive'
						onClick={new_game} 
					/>

				</DialogFooter>

			</DialogContent>
		</Dialog>
	</>
}
