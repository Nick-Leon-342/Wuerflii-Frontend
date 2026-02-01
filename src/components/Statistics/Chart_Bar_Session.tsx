

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
import type { Type__Server_Reponse__Player__Get } from '../../types/Type__Server_Response/Type__Server_Response__Player__GET'

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
)

  



interface Props__Chart_Bar {
	IsBorderVisible:	boolean
	List__Players:		Array<Type__Server_Reponse__Player__Get>
	JSON:				Record<Type__Server_Reponse__Player__Get['id'], number>
}

export default function Chart_Bar({
	IsBorderVisible, 
	List__Players, 
	JSON, 
}: Props__Chart_Bar) {

	if(!List__Players) return <></>

	return <>
		<Bar 
			data={{
				datasets: List__Players.map(player => ({
					label: player.Name, 
					data: [JSON[player.id]], 
					backgroundColor: player.Color + '70',
					borderColor: IsBorderVisible ? 'lightgray' : player.Color,
					borderWidth: 2,
				}))
			}}
		/>
	</>

}
