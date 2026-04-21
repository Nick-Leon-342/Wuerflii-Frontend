

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import type { Type__Session } from '@/types/Zod__Session'

import { ChartNoAxesColumn, Dices, Settings, Users } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'





interface Props___Session__Preview___Settings {
	do_final_scores_exist:	boolean
	session?: 				Type__Session
}

export default function Session__Preview___Settings({
	do_final_scores_exist, 
	session, 
}: Props___Session__Preview___Settings) {

	const navigate 	= useNavigate()
	const { t } 	= useTranslation()

	return <>
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='ghost'
					className='w-10 h-10'
				><Settings className='w-8! h-8!'/></Button>
			</PopoverTrigger>

			<PopoverContent 
				className='gap-4 [&_button]:justify-between'
				align='end'
			>
				
				{do_final_scores_exist && <>

					<Button
						variant='outline'
						onClick={() => navigate(`/session/${session?.id}/analytics`)}
					>
						{t('statistics')}
						<ChartNoAxesColumn/>
					</Button>

					<Separator/>
					
				</>}

				<span className='text-lg font-bold'>{t('edit')}</span>

				<Button
					onClick={() => navigate(`/session/${session?.id}`)}
					variant='outline'
				>
					{t('session')}
					<Dices/>
				</Button>
				
				<Button
					variant='outline'
					onClick={() => navigate(`/session/${session?.id}/players`)}
				>
					{t('players')}
					<Users/>
				</Button>

			</PopoverContent>
		</Popover>
	</>
}
