

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

import type { Type__Player } from '../../types/Zod__Player'

ChartJS.register(
	ArcElement, 
	Tooltip, 
	Legend
)





interface Props__Chart_Doughnut {
	IsBorderVisible:	boolean
	List__Players:		Array<Type__Player>
	Total_Wins:			Record<Type__Player['id'], number>
}

export default function Chart_Doughnut({ 
	IsBorderVisible, 
	List__Players, 
	Total_Wins, 
}: Props__Chart_Doughnut) {

	return <>
		<Doughnut 
			data={{
				labels: List__Players?.map(player => player.Name), 
				datasets: [{
					data: List__Players?.map(player => (Total_Wins && Total_Wins[player.id]) || 0), 
					borderColor: IsBorderVisible ? 'lightgray' : List__Players?.map(player => player.Color), 
					backgroundColor: List__Players?.map(player => player.Color + '70'),
					borderWidth: 2,
				}], 
			}}
		/>
	</>

}
