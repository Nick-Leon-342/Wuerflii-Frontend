

import type { Type__Player } from './Zod__Player'

export interface Type__Final_Score {
		id: 							number

		Start: 							Date
		End: 							Date
		Columns: 						number
		Surrendered:					boolean

		List_Winner:					Array<number>
		PlayerScores:					Record<Type__Player['id'], number>
		
		Wins__Before:					Record<Type__Player['id'], number>
		Wins__After:					Record<Type__Player['id'], number>
		Wins__Before_Year:				Record<Type__Player['id'], number>
		Wins__After_Year:				Record<Type__Player['id'], number>
		Wins__Before_Month:				Record<Type__Player['id'], number>
		Wins__After_Month:				Record<Type__Player['id'], number>
		Wins__Before_SinceCustomDate:	Record<Type__Player['id'], number>
		Wins__After_SinceCustomDate:	Record<Type__Player['id'], number>
}
