

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(
	ArcElement, 
	Tooltip, 
	Legend
)





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
					data: List_Players?.map(player => Total_Wins[player.id] || 0), 
					borderColor: IsBorderVisible ? 'black' : List_Players?.map(player => player.Color), 
					backgroundColor: List_Players?.map(player => player.Color + '70'),
					borderWidth: 2,
				}], 
			}}
		/>
	</>

}
