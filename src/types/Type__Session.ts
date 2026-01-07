

import type { Type__Client_To_Server__Player__POST } from './Type__Client_To_Server/Type__Client_To_Server__Player__POST'
import type { Type__Enum__View } from './Type__Enum/Type__Enum__View'
import type { Type__Enum__Month } from './Type__Enum/Type__Enum__Month'
import type { Type__Enum__Input_Type } from './Type__Enum/Type__Enum__Input_Type'
import type { Type__Enum__Statistics_View } from './Type__Enum/Type__Enum__Statistics_View'

export interface Type__Session {
	id: 							number
	Name:							string
	Color:							string
	Columns:						number

	Checkbox_Checked_To_Delete?:	boolean

	View_List_Years:				Array<number>
	CurrentGameStart:				Date | null
	LastPlayed:						Date | null

	InputType:						Type__Enum__Input_Type
	ShowScores:						boolean

	View: 							Type__Enum__View
	View_Month: 					Type__Enum__Month
	View_Year: 						number
	View_CustomDate:				Date

	Statistics_Show_Border: 		boolean
	Statistics_View: 				Type__Enum__Statistics_View
	Statistics_View_Month:			Type__Enum__Month
	Statistics_View_Year: 			number

	List_Players?:					Array<Type__Client_To_Server__Player__POST>
}
