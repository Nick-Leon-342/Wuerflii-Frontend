

import type { Type__Final_Score } from './Type__Final_Score'
import type { Type__Player } from './Zod__Player'

export interface Type__Final_Score__Session_Preview {
	id:								Type__Final_Score['id']
	Group_Date:						Date | null
	Wins__After:					Record<Type__Player['id'], number>
	Wins__After_Month:				Record<Type__Player['id'], number>
	Wins__After_Year:				Record<Type__Player['id'], number>
	Wins__After_SinceCustomDate:	Record<Type__Player['id'], number>
	PlayerScores:					Record<Type__Player['id'], number>
}
