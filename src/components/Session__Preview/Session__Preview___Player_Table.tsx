

import type { Type__Final_Score__Session_Preview } from '@/types/Type__Final_Score__Session_Preview'
import type { Type__Session } from '@/types/Zod__Session'
import type { Type__Player } from '@/types/Zod__Player'





interface Props___Session__Preview___Player_Table {
	current_top_row?:	Type__Final_Score__Session_Preview
	list__players:		Array<Type__Player>
	session:			Type__Session
}

export default function Session__Preview___Player_Table({
	current_top_row, 
	list__players, 
	session, 
}: Props___Session__Preview___Player_Table) {
	return <>
		<div className='flex flex-col w-full rounded-lg border-2 border-primary overflow-y-auto min-w-max [scrollbar-gutter:stable_both-edges] bg-green-200 dark:bg-green-950'>
			<table className='flex flex-col w-full [&_tr]:flex [&_td]:place-content-center [&_td]:w-full [&_td]:not-last-of-type:border-r [&_td]:min-w-30! [&_td]:border-primary [&_td]:h-12 [&_td]:truncate [&_td]:block [&_td]:text-center text-xl'>
				<tbody>
					<tr>
						{list__players.map(player => (
							<td key={player.id}>
								<span>{player.Name}</span>
							</td>
						))}
					</tr>
					{current_top_row && <>
						<tr className='border-t border-primary'>
							{list__players.map(player => {
								const id = player.id
								return (
									<td key={id}>
										<span>
											{session.View === 'SHOW__MONTH' 		&& (current_top_row.Wins__After_Month[id]			|| 0)}
											{session.View === 'SHOW__YEAR' 			&& (current_top_row.Wins__After_Year[id]			|| 0)}
											{session.View === 'SHOW__CUSTOM_DATE' 	&& (current_top_row.Wins__After_SinceCustomDate[id] || 0)}
											{session.View === 'SHOW__ALL' 			&& (current_top_row.Wins__After[id]					|| 0)}
										</span>
									</td>
								)
								
							})}
						</tr>
					</>}
				</tbody>
			</table>
		</div>
	</>
}
