

import { useTranslation } from 'react-i18next'

import type { Type__Server_Reponse__Player__Get } from '@/types/Type__Server_Response/Type__Server_Response__Player__GET'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import Custom_Button from '../misc/Custom_Button'
import { Button } from '../ui/button'





interface Props___Game__Surrender {
	loading__finish_game:	boolean
	setSurrender_winner:	React.Dispatch<React.SetStateAction<Type__Server_Reponse__Player__Get | undefined>>
	surrender_winner?:		Type__Server_Reponse__Player__Get
	list__players:			Array<Type__Server_Reponse__Player__Get>
	finish_game:			() => void
}

export default function Game__Surrender({
	loading__finish_game, 
	setSurrender_winner, 
	surrender_winner, 
	list__players, 
	finish_game, 
}: Props___Game__Surrender) {

	const { t } = useTranslation()

	return <>
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='destructive'
				>{t('surrender')}</Button>
			</DialogTrigger>

			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>{t('select_winner')}</DialogTitle>
				</DialogHeader>

				<div className='flex flex-col gap-2 overflow-hidden'>

					{surrender_winner ? <>

						{/* <h2 className='text-lg font-bold'>{t('sure_that_this_player_is_the_winner', { name: surrender_winner.Name })}</h2> */}
						{/* <h2 dangerouslySetInnerHTML={<span>{t('sure_that_this_player_is_the_winner', { name: surrender_winner.Name })}</span>} className='text-lg font-bold'/> */}
						<h2 
							dangerouslySetInnerHTML={{__html: t('sure_that_this_player_is_the_winner', { name: surrender_winner.Name })}} 
							className='text-lg font-bold [&_span]:text-2xl [&_span]:text-ellipsis [&_span]:text-nowrap'
						/>

						<Custom_Button
							loading={loading__finish_game}
							onClick={finish_game}
							text={t('yes')}
						/>

					</>:<>
					
						{list__players?.map(player => (
							<Button 
								onClick={() => setSurrender_winner(player)}
								style={{ backgroundColor: player.Color }}
								className='w-full text-ellipsis overflow-hidden'
								variant='outline'
								key={player.id} 
							><span className='text-ellipsis overflow-hidden'>{player.Name}</span></Button>
						))}

					</>}

				</div>

				{surrender_winner && <>
					<DialogFooter>
						<Button 
							variant='outline'
							onClick={() => setSurrender_winner(undefined)}
						>{t('cancel')}</Button>
					</DialogFooter>
				</>}
			</DialogContent>
		</Dialog>
	</>
}
