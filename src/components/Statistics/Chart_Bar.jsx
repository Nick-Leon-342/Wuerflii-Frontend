

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
	labels, 
	JSON, 
}) {

	if(!JSON) return <></>
	return <>
		<Bar 
			data={{
				labels,
				datasets: [{
					label: 'Spiele gespielt',
					data: Object.keys(JSON).map(key => JSON[key].Games_Played),
					backgroundColor: 'rgba(0, 230, 0, 0.3)',
					borderColor: 'rgba(0, 230, 0, 1)',
					borderWidth: 2,
				}]
			}}
		/>
	</>
	
}
