

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { useTranslation } from 'react-i18next'

import type { Type__Player } from '../../types/Zod__Player'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'


  


interface Props__Chart_Bar {
	IsBorderVisible:	boolean
	List__Players:		Array<Type__Player>

	Scores__Lowest:		Record<Type__Player['id'], number>
	Scores__Average:	Record<Type__Player['id'], number>
	Scores__Highest:	Record<Type__Player['id'], number>
}

export default function Chart_Bar({
	IsBorderVisible, 
	List__Players, 

	Scores__Lowest, 
	Scores__Average, 
	Scores__Highest, 
}: Props__Chart_Bar) {

	const { t } = useTranslation()





	function map_player_id_to_name(json: Record<Type__Player['id'], number>): Record<Type__Player['Name'], number> {

		const id_to_name_map: Record<Type__Player['id'], Type__Player['Name']> = {}
		List__Players.forEach(player => { id_to_name_map[player.id] = player.Name })

		const name_record: Record<Type__Player['Name'], number> = {}
		for(const [ id, value ] of Object.entries(json)) {
			const name = id_to_name_map[Number(id)]
			if(name) name_record[name] = value
		}

		return name_record
	}





	return <>
		<ChartContainer config={{ }}>
			<BarChart
				accessibilityLayer
				data={[
					{ Scores: t('points_minimum'), ...map_player_id_to_name(Scores__Lowest) }, 
					{ Scores: t('points_average'), ...map_player_id_to_name(Scores__Average) }, 
					{ Scores: t('points_maximum'), ...map_player_id_to_name(Scores__Highest) }, 
				]}
			>
				<CartesianGrid vertical={false}/>
				<XAxis
					dataKey='Scores'
					tickLine={false}
					tickMargin={10}
					axisLine={false}
				/>
				<ChartTooltip content={<ChartTooltipContent indicator='line'/>}/>
				{List__Players.map(player => (
					<Bar
						radius={5}
						key={player.id}
						dataKey={player.Name}
						fill={player.Color}
						stroke={IsBorderVisible ? 'lightgray' : 'none'}
					/>
				))}
			</BarChart>
		</ChartContainer>
	</>

}
