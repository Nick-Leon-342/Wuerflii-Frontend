

import type { Type__Player } from '../../types/Zod__Player'
import { useTranslation } from 'react-i18next'
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

  



interface Props__Chart_Bar {
	IsBorderVisible:	boolean
	List__Players:		Array<Type__Player>
	JSON:				Record<Type__Player['id'], number>
}

export default function Chart_Bar({
	IsBorderVisible, 
	List__Players, 
	JSON, 
}: Props__Chart_Bar) {

	const { t } = useTranslation()

	return <>
		<Bar 
			data={{
				labels: [t('statistics')], 
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
