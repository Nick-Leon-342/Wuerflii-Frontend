

import { Line } from 'react-chartjs-2'
import { useEffect, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)





export default function Chart_Graph({
	statistics_view_month, 
	statistics_view_year, 
	statistics_view, 

	IsBorderVisible, 
	List_Players, 
	List_Months, 
	Counts, 
}) {

	const [ labels, setLabels ] = useState()
	const [ values, setValues ] = useState()





	useEffect(() => {

		if(!Counts || !List_Players) return

		let tmp_labels = []
		let tmp_values = []

		let incremental_values = {}
		for(const player of List_Players) { incremental_values[player.id] = 0 }

		if(statistics_view === 'statistics_overall') {
			for(const key of Object.keys(Counts)) {
				const winners = Counts[key].Winners
				for(const id of Object.keys(winners)) {
					incremental_values[id] = incremental_values[id] + winners[id]
				}
				tmp_labels.push(key)
				tmp_values.push(structuredClone(incremental_values))
			}
		}


		if(statistics_view === 'statistics_year') {
			tmp_labels = [ 0, ...List_Months ]
			const year = Counts[statistics_view_year]
			if(!year) {
				tmp_values = tmp_labels.map(_ => {
					const json = {}
					List_Players.map(player => json[player.id] = 0)
					return json
				})
			} else {
				for(let i = 0; List_Months.length >= i; i++) {
					const month = year[i]
					if(!month) {
						tmp_values.push(structuredClone(incremental_values))
					} else {
						const winners = month.Winners
						for(const id of Object.keys(winners)) {
							incremental_values[id] = incremental_values[id] + winners[id]
						}
						tmp_values.push(structuredClone(incremental_values))
					}
				}
			}
		}

		setLabels(tmp_labels)
		setValues(tmp_values)

	}, [
		Counts, 
		List_Months, 
		List_Players, 
		statistics_view, 
		statistics_view_year, 
		statistics_view_month, 
	])





	return <>
		{Counts && List_Players && labels?.length > 0 && values?.length > 0 && <>
			<Line
				data={{
					labels, 
					datasets: List_Players?.map(player => ({
						label: player.Name, 
						data: values?.map(value => value[player.id]), 
						// borderWidth: IsBorderVisible ? 1 : 0,
						// borderColor: IsBorderVisible ? 'black' : '', 
						borderColor: player.Color, 
						backgroundColor: player.Color, 
						// backgroundColor: 'transparent',
						// tension: 0.3,
						tension: .2,
					}))
				}}
				options={{ scales: { y: { beginAtZero: true } } }}
			/>
		</>}
	</>
}
