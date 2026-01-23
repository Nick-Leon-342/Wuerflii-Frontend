

import type { Enum__Month } from '../Enum/Enum__Month'
import type { Enum__View_Sessions } from '../Enum/Enum__View_Sessions'
import type { Enum__Statistics_View } from '../Enum/Enum__Statistics_View'

export interface Type__Client_To_Server__User__PATCH {
	Name?:						string
	Password?:					string
	DarkMode?:					boolean

	Show__Session_Names?:		boolean
	Show__Session_Date?:			boolean
	View__Sessions?:				Enum__View_Sessions
	View__Sessions_Desc?:		boolean

	Statistics__View?:			Enum__Statistics_View
	Statistics__View_Month?:	Enum__Month
	Statistics__View_Year?:		number
}
