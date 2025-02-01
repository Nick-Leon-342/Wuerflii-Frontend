

import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
)
 
  



export default function Chart_Bar({
	Counts, 

	list_months, 

	statistics_view, 
	statistics_view_year, 
	statistics_view_month, 	// January = 1, February = 2, ...
}) {

	const [ labels, setLabels ] = useState([])
	const [ values, setValues ] = useState([])





	useEffect(() => {

		if(!Counts) return 

		
		let tmp_labels = []
		let tmp_values = []

		if(statistics_view === 'statistics_years') {
			for(const year of Object.keys(Counts)) {
				tmp_labels.push(year)
				tmp_values.push(Counts[year].Total)
			}
		}

		if(statistics_view === 'statistics_months_of_year') {
			tmp_labels = list_months

			const year = Counts[statistics_view_year]
			for(let i = 1; list_months.length > i; i++) {
				const month = year && year[i]
				if(!month) {
					tmp_values.push(0)
				} else {
					tmp_values.push(month.Total)
				}
			}
		}

		if(statistics_view === 'statistics_days_of_month') {
			const daysInMonth = new Date(statistics_view_year, statistics_view_month, 0).getDate()
			tmp_labels = Array.from({ length: daysInMonth }, (_, i) => i + 1)

			const year = Counts[statistics_view_year]
			const month = year && year[statistics_view_month]

			if(!month) {
				tmp_values = tmp_labels.map(_ => 0)
			} else {
				for(let i = 1; tmp_labels.length > i; i++) {
					console.log(month[i], i)
					tmp_values.push(month[i] || 0)
				}
			}			
		}
		

		setValues(tmp_values)
		setLabels(tmp_labels)

		// eslint-disable-next-line
	}, [ Counts, statistics_view, statistics_view_month, statistics_view_year ])





	return <>
		<Bar 
			data={{
				labels,
				datasets: [{
					label: 'Counts',
					data: values,
					backgroundColor: 'rgba(0, 230, 0, 0.3)',
					borderColor: 'rgba(0, 230, 0, 1)',
					borderWidth: 2,
				}]
			}}
		/>
	</>
}