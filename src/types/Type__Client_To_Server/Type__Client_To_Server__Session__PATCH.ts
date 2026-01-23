

import type { Enum__View } from '../Enum/Enum__View'
import type { Enum__Month } from '../Enum/Enum__Month'
import type { Enum__Input_Type } from '../Enum/Enum__Input_Type'
import type { Enum__Statistics_View } from '../Enum/Enum__Statistics_View'

export interface Type__Client_To_Server__Session__PATCH {
		SessionID:					number

		Name?: 						string
		Color?:						string
		Columns?:					number

		View?:						Enum__View
		View__Month?: 				Enum__Month
		View__Year?:					number
		
		Input_Type?:					Enum__Input_Type
		Show_Scores?:			boolean

		Statistics__Show_Border?:	boolean
		Statistics__View?:			Enum__Statistics_View
		Statistics__View_Month?:		Enum__Month
		Statistics__View_Year?:		number
}
