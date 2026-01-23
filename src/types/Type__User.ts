

import type { Enum__Month } from './Enum/Enum__Month'
import type { Enum__View_Sessions } from './Enum/Enum__View_Sessions'
import type { Enum__Statistics_View } from './Enum/Enum__Statistics_View'

export interface Type__User {
	id:						number
	Name:					string
	DarkMode:				boolean

	Show_Session_Names:		boolean
	Show_Session_Date:		boolean
	
	View_Sessions:			Enum__View_Sessions
	View_Sessions_Desc:		boolean

	Statistics__View:		Enum__Statistics_View
	Statistics__View_Month:	Enum__Month
	Statistics__View_Year:	number
}
