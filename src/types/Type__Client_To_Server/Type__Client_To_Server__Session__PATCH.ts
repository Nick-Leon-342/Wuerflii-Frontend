

import type { Type__Enum__View } from '../Type__Enum/Type__Enum__View'
import type { Type__Enum__Input_Type } from '../Type__Enum/Type__Enum__Input_Type'
import type { Type__Enum__Statistics_View } from '../Type__Enum/Type__Enum__Statistics_View'

export interface Type__Client_To_Server__Session__PATCH {
		SessionID:					number

		Name?: 						string
		Color?:						string
		Columns?:					number

		View?:						Type__Enum__View
		View_Month?: 				1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
		View_Year?:					number
		
		InputType?:					Type__Enum__Input_Type
		Scores_Visible?:			boolean

		Statistics_Show_Border?:	boolean
		Statistics_View?:			Type__Enum__Statistics_View
		Statistics_View_Month?:		1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
		Statistics_View_Year?:		number
}
