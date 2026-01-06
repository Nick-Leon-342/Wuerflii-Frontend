

import type { Type__Enum__View } from './Type__Enum/Type__Enum__View'
import type { Type__Enum__Input_Type } from './Type__Enum/Type__Enum__Input_Type'
import type { Type__Enum__Statistics_View } from './Type__Enum/Type__Enum__Statistics_View'

export interface Type__Session {
	id: 					number
	Name:					string
	Color:					string
	Columns:				number

	View_List_Years:		Array<number>
	CurrentGameStart:		Date | null
	LastPlayed:				Date | null


	InputType:				Type__Enum__Input_Type
	ShowScores:				boolean

	View: 					Type__Enum__View
	View_Month: 			1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
	View_Year: 				number
	View_CustomDate:		Date

	Statistics_Show_Border: boolean
	Statistics_View: 		Type__Enum__Statistics_View
	Statistics_View_Month:	1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
	Statistics_View_Year: 	number
}
