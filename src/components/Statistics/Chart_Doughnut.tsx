

import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

import type { Type__Server_Reponse__Player__Get } from '../../types/Type__Server_Response/Type__Server_Response__Player__GET'

ChartJS.register(
	ArcElement, 
	Tooltip, 
	Legend
)





interface Props__Chart_Doughnut {
	IsBorderVisible:	boolean
	List_Players:		Array<Type__Server_Reponse__Player__Get>
	Total_Wins:			Record<Type__Server_Reponse__Player__Get['id'], number>
}

export default function Chart_Doughnut({ 
	IsBorderVisible, 
	List_Players, 
	Total_Wins, 
}: Props__Chart_Doughnut) {

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
