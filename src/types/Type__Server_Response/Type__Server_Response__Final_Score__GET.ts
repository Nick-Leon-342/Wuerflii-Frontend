import type { Type__Client_To_Server__Player__POST } from "../Type__Client_To_Server/Type__Client_To_Server__Player__POST"


export interface Type__Server_Response__Final_Score__GET {
		id: 							number

		Start: 							Date
		End: 							Date
		Columns: 						number
		Surrendered:					boolean

		List_Winner:					Array<number>
		PlayerScores:					Record<Type__Client_To_Server__Player__POST['id'], number>
		
		Wins__Before:					Record<Type__Client_To_Server__Player__POST['id'], number>
		Wins__After:					Record<Type__Client_To_Server__Player__POST['id'], number>
		Wins__Before_Year:				Record<Type__Client_To_Server__Player__POST['id'], number>
		Wins__After_Year:				Record<Type__Client_To_Server__Player__POST['id'], number>
		Wins__Before_Month:				Record<Type__Client_To_Server__Player__POST['id'], number>
		Wins__After_Month:				Record<Type__Client_To_Server__Player__POST['id'], number>
		Wins__Before_SinceCustomDate:	Record<Type__Client_To_Server__Player__POST['id'], number>
		Wins__After_SinceCustomDate:	Record<Type__Client_To_Server__Player__POST['id'], number>
}
