

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import type { Type__Session, Type__Session_PATCH } from '../../types/Zod__Session'
import type { Type__Player_With_Table_Columns } from '@/types/Zod__Player'
import { Enum__Input_Type } from '../../types/Enum/Enum__Input_Type'
import useErrorHandling from '../../hooks/useErrorHandling'
import { patch__session } from '../../api/session/session'
import { delete__game } from '@/api/game'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Settings, Square, SquareCheck, UserCog } from 'lucide-react'
import Custom_Button from '../misc/Custom_Button'
import Game__Surrender from './Game__Surrender'
import { Spinner } from '../ui/spinner'
import { Button } from '../ui/button'
import { toast } from 'sonner'





interface Props___Game__Settings {
	list__player_with_table_columns:	Array<Type__Player_With_Table_Columns>
	loading__finish_game:				boolean
	setSurrender_winner:				React.Dispatch<React.SetStateAction<Type__Player_With_Table_Columns | undefined>>
	surrender_winner?:					Type__Player_With_Table_Columns
	finish_game:						() => void
	setSession:							React.Dispatch<React.SetStateAction<Type__Session | undefined>>
	session?:							Type__Session
}

export default function Game__Settings({
	list__player_with_table_columns, 
	loading__finish_game, 
	setSurrender_winner, 
	surrender_winner, 
	finish_game, 
	setSession, 
	session, 
}: Props___Game__Settings) {

	const navigate 		= useNavigate()
	const { t } 		= useTranslation()
	const query_client 	= useQueryClient()
	const handle_error 	= useErrorHandling()

	const [ loading_newGame, setLoading_newGame ] = useState(false)





	// ____________________ Session settings ____________________

	const mutate__session = useMutation({
		mutationFn: (json: Type__Session_PATCH) => patch__session(+(session?.id || -1), json), 
		onSuccess: (_, json) => {
			if(!session) return
			setSession(prev => {
				if(!prev) return prev
				return { ...prev, ...json }
			})
			query_client.setQueryData([ 'session', session.id ], (prev: Type__Session) => ({ ...prev, ...json }))
		}
	})

	function change__input_type(input_type: (typeof Enum__Input_Type)[number]) { mutate__session.mutate({ Input_Type: input_type }) }
	function change__scores_visible() { if(session) mutate__session.mutate({ Show_Scores: !session.Show_Scores }) }


	// ____________________ New Game ____________________

	function new_game() {

		if(!session) return
		if(!window.confirm(t('sure_you_want_to_delete_this_game'))) return 
		setLoading_newGame(true)
	
		delete__game(session.id).then(() => {

			query_client.removeQueries({ queryKey: [ 'session', session.id, 'table_columns' ] })
			navigate('/', { replace: true })
			toast.success(t('successfully.deleted'))

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
					className='w-12 h-12'
				><Settings className='w-8! h-8!'/></Button>
			</DialogTrigger>



			<DialogContent showCloseButton={false}>

				<DialogHeader>
					<DialogTitle>{t('settings')}</DialogTitle>
				</DialogHeader>



				<div className='flex flex-col gap-4'>

					{/* ____________________ Input_Type ____________________ */}

					<Select
						onValueChange={(value) => change__input_type(value as (typeof Enum__Input_Type)[number])}
						disabled={mutate__session.isPending}
						value={session?.Input_Type}
					>
						<SelectTrigger>
							<SelectValue/>
						</SelectTrigger>

						<SelectContent>
							<SelectGroup>
								<SelectLabel>{t('input_type.name')}</SelectLabel>
								{Enum__Input_Type.map(input_type => (
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
						disabled={mutate__session.isPending}
						onClick={change__scores_visible}
						className='justify-between'
						variant='outline'
					>
						<span>{t('show_scores')}</span>
						{mutate__session.isPending && <Spinner/>}
						{!mutate__session.isPending && (session?.Show_Scores
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

					<Game__Surrender
						loading__finish_game={loading__finish_game}
						setSurrender_winner={setSurrender_winner}
						surrender_winner={surrender_winner}
						list__player_with_table_columns={list__player_with_table_columns}
						finish_game={finish_game}
					/>



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
