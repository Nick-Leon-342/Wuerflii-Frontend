

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(
	ArcElement, 
	Tooltip, 
	Legend
)





/**
 * 
 * Chart_Doughnut component renders a doughnut chart displaying the total wins for each player.
 * It uses the react-chartjs-2 library to visualize the data.
 *
 * @component
 * @example
 * // Example usage of Chart_Doughnut component
 * <Chart_Doughnut
 *   IsBorderVisible={true}
 *   List_Players={playersList}
 *   Total_Wins={totalWinsData}
 * />
 *
 * @param {Object} props - The component props
 * @param {boolean} props.IsBorderVisible - Flag to determine whether to show a border around the chart segments
 * @param {Array} props.List_Players - Array of player objects containing player details like `Name` and `Color`
 * @param {Object} props.Total_Wins - An object mapping player IDs to the total wins, where the key is the player ID and the value is the number of wins
 *
 * @returns {JSX.Element} The rendered doughnut chart component
 * 
 */

export default function Chart_Doughnut({ 
	IsBorderVisible, 
	List_Players, 
	Total_Wins, 
}) {

	return <>
		<Doughnut 
			data={{
				labels: List_Players?.map(player => player.Name), 
				datasets: [{
					data: List_Players?.map(player => (Total_Wins && Total_Wins[player.id]) || 0), 
					borderColor: IsBorderVisible ? 'black' : List_Players?.map(player => player.Color), 
					backgroundColor: List_Players?.map(player => player.Color + '70'),
					borderWidth: 2,
				}], 
			}}
		/>
	</>

}
