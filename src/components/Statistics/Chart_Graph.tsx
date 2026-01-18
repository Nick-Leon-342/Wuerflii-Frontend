

import { Line } from 'react-chartjs-2'

import { useEffect, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

import type { Type__Server_Reponse__Player__Get } from '../../types/Type__Server_Response/Type__Server_Response__Player__GET'
import type { Type__Server_Response__Analytics_Session__GET__Data } from '../../types/Type__Server_Response/Type__Server_Response__Analytics_Session__GET'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)





interface Props__Chart_Graph {
	IsBorderVisible:	boolean
	List_Players:		Array<Type__Server_Reponse__Player__Get>
	labels:				Array<string>
	Data:				Record<string, Type__Server_Response__Analytics_Session__GET__Data>
}

export default function Chart_Graph({
	IsBorderVisible, 
	List_Players, 
	labels, 
	Data, 
}: Props__Chart_Graph) {

	const [ values, setValues ] = useState<Array<Record<Type__Server_Reponse__Player__Get['id'], number>>>([])





	// Makes extremely light colors black
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
		return luminance > 230 ? 'rgb(100, 100, 100)' : hex

	}

	useEffect(() => {
		function init() {
			console.log(Data)
			if(!List_Players || !Data) return
	
			const tmp_values = []
			const incremental_values: Record<Type__Server_Reponse__Player__Get['id'], number> = {}
			for(const player of List_Players) incremental_values[player.id] = 0
	
			for(const key of Object.keys(Data)) {
				for(const player of List_Players) {
					const id = player.id
					incremental_values[id] = incremental_values[id] + (Data[key].Wins[id] || 0)
				}
				tmp_values.push(structuredClone(incremental_values))
			}
	
			setValues(tmp_values)
		}
		init()
	}, [ List_Players, Data ])





	if(!Data) return <></>
	return <>
		<Line
			data={{
				labels, 
				datasets: List_Players?.map(player => ({
					backgroundColor: IsBorderVisible ? adjustColor(player.Color) : player.Color, 
					borderColor: IsBorderVisible ? adjustColor(player.Color) : player.Color, 
					data: values?.map(value => value[player.id]), 
					label: player.Name, 
					tension: .2,
				}))
			}}
			options={{ scales: { y: { beginAtZero: true } } }}
		/>
	</>
}
