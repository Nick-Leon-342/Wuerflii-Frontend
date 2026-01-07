

import type { Type__Enum__Month } from '../Type__Enum/Type__Enum__Month'
import type { Type__Enum__View_Sessions } from '../Type__Enum/Type__Enum__View_Sessions'
import type { Type__Enum__Statistics_View } from '../Type__Enum/Type__Enum__Statistics_View'

export interface Type__Client_To_Server__User__PATCH {
	Name?:					string
	Password?:				string
	DarkMode?:				boolean

	Show_Session_Names?:	boolean
	Show_Session_Date?:		boolean
	View_Sessions?:			Type__Enum__View_Sessions
	View_Sessions_Desc?:	boolean

	Statistics_View?:		Type__Enum__Statistics_View
	Statistics_View_Month?:	Type__Enum__Month
	Statistics_View_Year?:	number
}
