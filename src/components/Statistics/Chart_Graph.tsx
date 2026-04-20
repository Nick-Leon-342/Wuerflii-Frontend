

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { useEffect, useState } from 'react'

import type { Type__Analytics_Session__Data } from '../../types/Type__Analytics_Session'
import type { Type__Player } from '../../types/Zod__Player'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart'





interface Props__Chart_Graph {
	Data:				Record<string, Type__Analytics_Session__Data>
	List__Players:		Array<Type__Player>
	labels:				Array<string>
	IsBorderVisible:	boolean
}

export default function Chart_Graph({
	IsBorderVisible, 
	List__Players, 
	labels, 
	Data, 
}: Props__Chart_Graph) {

	const [ values, setValues ] = useState<Array<Type__Chart_Data>>([])





	interface Type__Chart_Data {
		Time:							string
		[key: Type__Player['Name']]: 	string
	}

	useEffect(() => {
		function init() {
			
			if(!List__Players || !Data) return
	
			const tmp_values = []
			const incremental_values: Type__Chart_Data = { Time: '' }
			for(const player of List__Players) incremental_values[player.Name] = '0'
	
			const list = Object.keys(Data)
			for(let i = 0; i < list.length; i++) {
				incremental_values.Time = labels[i]
				for(const player of List__Players) {
					const name = player.Name
					incremental_values[name] = (parseInt(incremental_values[name]) + (Data[list[i]].Wins[player.id] || 0)).toString()
				}
				tmp_values.push(structuredClone(incremental_values))
			}
	
			setValues(tmp_values)
		}
		init()
	}, [ List__Players, Data ])

	const adjustColor = ( hex: string ) => {
	
		if (!hex.startsWith("#") || (hex.length !== 4 && hex.length !== 7)) return hex
	
		let r, g, b
		
		if (hex.length === 4) {
			r = parseInt(hex[1] + hex[1], 16);
			g = parseInt(hex[2] + hex[2], 16);
			b = parseInt(hex[3] + hex[3], 16);
		} else {
			r = parseInt(hex.slice(1, 3), 16);
			g = parseInt(hex.slice(3, 5), 16);
			b = parseInt(hex.slice(5, 7), 16);
		}

		const luminance = 0.299 * r + 0.587 * g + 0.114 * b
		return luminance > 230 ? 'lightgray' : hex

	}





	return <>
		<ChartContainer config={{ }}>
			<AreaChart
				accessibilityLayer
				data={values}
				margin={{
					left: 30, 
					right: 30, 
				}}
			>
				<CartesianGrid vertical={false}/>
				<XAxis
					dataKey='Time'
				/>
				<ChartTooltip
					content={<ChartTooltipContent indicator='line'/>}
				/>

				{List__Players.map(player => (
					<Area
						type='monotone'
						key={player.id}
						dataKey={player.Name}
						fillOpacity={0.4}
						stackId={player.id}
						// fill={`${player.Color}70`} 
						fill='none'
						strokeWidth={5}
						stroke={IsBorderVisible ? adjustColor(player.Color) : player.Color}
					/>
				))}
			</AreaChart>
		</ChartContainer>
	</>
}
