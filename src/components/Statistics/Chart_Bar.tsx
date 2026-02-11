

import type { Type__Server_Response__Analytics__GET__Data } from '../../types/Type__Server_Response/Type__Server_Response__Analytics__GET'
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
	labels:	Array<string>
	data:	Type__Server_Response__Analytics__GET__Data
}

export default function Chart_Bar({
	labels, 
	data, 
}: Props__Chart_Bar) {

	const { t } = useTranslation()

	if(!JSON) return <></>
	return <>
		<Bar 
			data={{
				labels,
				datasets: [{
					label: t('games_played'),
					data: Object.keys(data).map(key => data[key].Games_Played),
					backgroundColor: 'rgba(0, 230, 0, 0.3)',
					borderColor: 'rgba(0, 230, 0, 1)',
					borderWidth: 2,
				}]
			}}
		/>
	</>
	
}
