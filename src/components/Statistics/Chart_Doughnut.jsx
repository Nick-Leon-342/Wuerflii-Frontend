

import { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(
	ArcElement, 
	Tooltip, 
	Legend
)





export default function Chart_Doughnut({
	statistics_view_month, 	// January = 1, February = 2, ...
	statistics_view_year, 
	statistics_view, 
	
	
	IsBorderVisible, 
	List_Players, 
	
	Counts, 
	Total, 
}) {

	const [ values, setValues ] = useState([])





	useEffect(() => {

		if(!Counts || !List_Players) return

		let tmp_values = []
		
		if(statistics_view === 'statistics_overall') tmp_values = List_Players?.map(player => Total[player.id])

		if(statistics_view === 'statistics_year') {
			if(!Counts[statistics_view_year]) {
				tmp_values = List_Players?.map(_ => 0)
			} else {
				for(const player of List_Players) {
					tmp_values.push(Counts[statistics_view_year].Winners[player.id])
				}
			}			
		}

		if(statistics_view === 'statistics_month') {
			if(!Counts[statistics_view_year] || !Counts[statistics_view_year][statistics_view_month]) {
				tmp_values = List_Players?.map(_ => 0)
			} else {
				for(const player of List_Players) {
					tmp_values.push(Counts[statistics_view_year][statistics_view_month].Winners[player.id])
				}
			}	
		}

		setValues(tmp_values)

		// eslint-disable-next-line
	}, [ 
		statistics_view_month, 
		statistics_view_year, 
		statistics_view, 
		List_Players, 
		Counts, 
	])





	return <>
		<Doughnut 
			data={{
				labels: List_Players?.map(player => player.Name), 
				datasets: [{
					data: values, 
					borderWidth: IsBorderVisible ? 1 : 0,
					borderColor: IsBorderVisible ? 'black' : '', 
					backgroundColor: List_Players?.map(player => player.Color),
				}], 
			}}
		/>
	</>
}
