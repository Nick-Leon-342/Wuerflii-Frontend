

import React from 'react'
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





/**
 * 
 * Chart_Bar component renders a bar chart displaying the number of games played for each player.
 * It uses the react-chartjs-2 library to visualize the data.
 *
 * @component
 * @example
 * // Example usage of Chart_Bar component
 * <Chart_Bar
 *   labels={playerLabels}
 *   JSON={playerData}
 * />
 *
 * @param {Object} props - The component props
 * @param {Array} props.labels - Array of player names or labels to display on the X-axis of the chart
 * @param {Object} props.JSON - An object containing player data. The keys are player IDs and the values are objects containing player stats, including `Games_Played`.
 *
 * @returns {JSX.Element} The rendered bar chart component
 * 
 */

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
