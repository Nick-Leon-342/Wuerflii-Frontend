

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
 * Chart_Bar component renders a bar chart using the react-chartjs-2 library.
 * It accepts player data and displays their scores or values as bars in the chart.
 *
 * @component
 * @example
 * // Example usage of Chart_Bar component
 * <Chart_Bar
 *   IsBorderVisible={true}
 *   List_Players={players}
 *   JSON={playerScores}
 * />
 *
 * @param {Object} props - The component props
 * @param {boolean} props.IsBorderVisible - Determines whether borders should be visible around the bars
 * @param {Array} props.List_Players - Array of player objects, each containing `Name`, `id`, and `Color` properties
 * @param {Object} props.JSON - An object where each key is a player's `id` and the value is their score or data point
 *
 * @returns {JSX.Element} The rendered bar chart component
 * 
 */

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
