

import { Line } from 'react-chartjs-2'
import { useEffect, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)





export default function Chart_Graph({
	IsBorderVisible, 
	List_Players, 
	labels, 
	Data, 
}) {

	// const [ labels, setLabels ] = useState()
	const [ values, setValues ] = useState()





	useEffect(() => {

		if(!List_Players || !Data) return

		const tmp_values = []
		let incremental_values = {}
		for(const player of List_Players) incremental_values[player.id] = 0

		for(const key of Object.keys(Data)) {
			for(const player of List_Players) {
				const id = player.id
				incremental_values[id] = incremental_values[id] + (Data[key].Wins[id] || 0)
			}
			tmp_values.push(structuredClone(incremental_values))
		}

		setValues(tmp_values)

	}, [ List_Players, Data ])


	if(!Data) return <></>
	return <>
		<Line
			data={{
				labels, 
				datasets: List_Players?.map(player => ({
					data: values?.map(value => value[player.id]), 
					// data: Object.keys(Data).map(key => Data[key].Wins[player.id] || 0), 
					backgroundColor: player.Color, 
					borderColor: player.Color, 
					label: player.Name, 
					tension: .2,
					// borderWidth: IsBorderVisible ? 1 : 0,
					// borderColor: IsBorderVisible ? 'black' : '', 
					// backgroundColor: 'transparent',
					// tension: 0.3,
				}))
			}}
			options={{ scales: { y: { beginAtZero: true } } }}
		/>
	</>
}
