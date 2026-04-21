

import { useTranslation } from 'react-i18next'

import type { Type__Analytics__Data } from '../../types/Type__Analytics'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ChartContainer } from '../ui/chart'





interface Props__Chart_Bar {
	labels:	Array<string>
	data:	Type__Analytics__Data
}

export default function Chart_Bar({
	labels, 
	data, 
}: Props__Chart_Bar) {

	const { t } = useTranslation()

	const chart_data = Object.keys(data).map((key, index) => ({
		Time:			labels[index], 
		Games_Played: 	data[key].Games_Played
	}))





	return <>
		<Card>
			<CardHeader>
				<CardTitle>{t('games_played')}</CardTitle>
			</CardHeader>

			<CardContent>
				<ChartContainer config={{ }}>
					<BarChart
						accessibilityLayer
						data={chart_data}
						margin={{ top: 25 }}
					>
						<CartesianGrid vertical={false}/>
						<XAxis
							dataKey='Time'
							tickLine={false}
							tickMargin={10}
							axisLine={false}
						/>
						<Bar dataKey='Games_Played' fill='var(--primary)' radius={8}>
							<LabelList
								position='top'
								offset={12}
								className='fill-foreground'
								fontSize={15}
								fontWeight={600}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>

	</>
	
}
