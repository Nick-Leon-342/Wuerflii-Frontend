

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import useErrorHandling from '@/hooks/useErrorHandling'

import type { Type__Client_To_Server__Gnadenwurf__PATCH } from '../../../types/Type__Client_To_Server/Type__Client_To_Server__Gnadenwurf__PATCH'
import type { Type__Player_With_Table_Columns } from '../../../types/Type__Player_With_Table_Columns'
import type { Type__Session } from '../../../types/Type__Session'

import { patch__gnadenwurf } from '../../../api/gnadenwurf'

import { Square, SquareCheck } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'





interface Props__Table_Player {
	setList__player_with_table_columns:	React.Dispatch<React.SetStateAction<Array<Type__Player_With_Table_Columns>>>
	list__player_with_table_columns:	Array<Type__Player_With_Table_Columns>

	disabled:			boolean
	session:			Type__Session
}

export default function Table_Player({ 
	setList__player_with_table_columns, 
	list__player_with_table_columns, 

	disabled, 
	session, 
}: Props__Table_Player) {

	const { t } = useTranslation()

	const width_player_column = session.Columns * 60





	function calculateScore(index_player: number): number {

		if(list__player_with_table_columns.length === 0) return 0

		let sum = 0
		for(const tc of list__player_with_table_columns[index_player].List__Table_Columns) { sum += tc.TotalScore }
		return sum

	}





	return <>
		<div className='flex flex-col text-lg font-bold rounded-lg! border-muted-foreground border-2 overflow-hidden [&_section]:border-muted-foreground [&_section]:h-12 [&_div]:flex [&_div]:items-center [&_div]:min-w-0 [&_div]:px-1 [&_div]:justify-center [&_div]:flex-1 [&_div]:text-center [&_span]:truncate [&_div]:not-last-of-type:border-r-2 [&_div]:border-muted-foreground'>

			{/* __________________________________________________ Names __________________________________________________ */}

			<section className='flex flex-row justify-between border-b'>

				<div className='min-w-[240px]! max-w-[240px]! w-[240px]!'><span>{t('player')}</span></div>

				{list__player_with_table_columns?.map((player, index_player) => 
					<div 
						key={index_player}
						style={{ maxWidth: `${width_player_column}px`, minWidth: `${width_player_column}px`, width: `${width_player_column}px` }}
					>
						<span>{player.Name}</span>
					</div>
				)}

			</section>



			{/* __________________________________________________ Scores __________________________________________________ */}

			{session.Show_Scores && <>
				<section className={`flex flex-row justify-between${disabled ? ' border-b-2': ' border-b'}`}>

					<div className='min-w-[240px]! max-w-[240px]! w-[240px]!'><span>{t('score')}</span></div>

					{list__player_with_table_columns?.map((_, index_player) => 
						<div 
							key={index_player}
							style={{ maxWidth: `${width_player_column}px`, minWidth: `${width_player_column}px`, width: `${width_player_column}px` }}
						>
							<span>{calculateScore(index_player)}</span>
						</div>
					)}

				</section>
			</>}



			{/* __________________________________________________ Gnadenwurf __________________________________________________ */}

			{!disabled && <>
				<section className='flex flex-row justify-between'>

					<div className='min-w-[240px]! max-w-[240px]! w-[240px]!'><span>Gnadenwurf</span></div>

					{list__player_with_table_columns?.map((_, index_player) => 
						<div 
							key={index_player}
							style={{ maxWidth: `${width_player_column}px`, minWidth: `${width_player_column}px`, width: `${width_player_column}px` }}
						>
								<Gnadenwurf
									setList__player_with_table_columns={setList__player_with_table_columns}
									list__player_with_table_columns={list__player_with_table_columns}
									index_player={index_player}
									session={session}
								/>
						</div>
					)}

				</section>
			</>}
		</div>
	</>
}





interface Props__Gnadenwurf {
	setList__player_with_table_columns:	React.Dispatch<React.SetStateAction<Array<Type__Player_With_Table_Columns>>>
	list__player_with_table_columns:	Array<Type__Player_With_Table_Columns>

	index_player:		number
	session:			Type__Session
}

const Gnadenwurf = ({
	setList__player_with_table_columns, 
	list__player_with_table_columns, 

	index_player, 
	session, 
}: Props__Gnadenwurf) => {

	const navigate 		= useNavigate()
	const { t } 		= useTranslation()
	const query_client 	= useQueryClient()
	const handle_error 	= useErrorHandling()

	const mutate__gnadenwurf = useMutation({
		mutationFn: (json: Type__Client_To_Server__Gnadenwurf__PATCH) => patch__gnadenwurf(json), 
		onSuccess: (_, json) => {
			setList__player_with_table_columns(prev => {
				const tmp = [ ...prev ]
				tmp[index_player].Gnadenwurf_Used = json.Gnadenwurf_Used
				query_client.setQueryData([ 'session', session.id, 'players' ], tmp)
				return tmp 
			})
		}, 
		onError: (err, json) => {
			handle_error({
				err, 
				handle_no_server_response: () => {
					if(window.confirm(t('synchronization_of_gnadenwurf_failed', { name: list__player_with_table_columns[index_player].Name }))) mutate__gnadenwurf.mutate(json)
				}, 
				handle_404: () => {
					alert(t('error.resource_not_found'))
					navigate(`/`)
				}, 
				handle_500: () => {
					if(window.confirm(t('synchronization_of_gnadenwurf_failed', { name: list__player_with_table_columns[index_player].Name }))) mutate__gnadenwurf.mutate(json)
				}
			})
		}
	})





	const change = async () => {

		const bool = !list__player_with_table_columns[index_player].Gnadenwurf_Used

		mutate__gnadenwurf.mutate({
			SessionID: session.id, 
			PlayerID: list__player_with_table_columns[index_player].id, 
			Gnadenwurf_Used: bool
		})

	}





	return <>
		{mutate__gnadenwurf.isPending && <Spinner/>}

		{!mutate__gnadenwurf.isPending &&
			<Button
				variant='ghost'
				onClick={change}
				className='h-10 w-10 [&_svg]:w-6! [&_svg]:h-6!'
			>
				{list__player_with_table_columns[index_player].Gnadenwurf_Used
					? <SquareCheck/>
					: <Square/>
				}
			</Button>
		}
	</>
}
