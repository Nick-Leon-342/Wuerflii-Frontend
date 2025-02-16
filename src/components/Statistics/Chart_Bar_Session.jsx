

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
	IsBorderVisible, 
	List_Players, 
	JSON, 
}) {

	if(!List_Players) return <></>

	return <>
		<Bar 
			data={{
				labels: ' ', 
				datasets: List_Players.map(player => ({
					label: player.Name, 
					data: [JSON[player.id]], 
					backgroundColor: player.Color + '70',
					borderColor: IsBorderVisible ? 'black' : player.Color,
					borderWidth: 2,
				}))
			}}
		/>
	</>

}
