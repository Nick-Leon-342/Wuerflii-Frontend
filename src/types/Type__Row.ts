

import type { TFunction } from 'i18next'
import type { ReactNode } from 'react'

export interface Type__Row {
	Name: 				string
	Possible_Entries?:	Array<number>
	Border_Top?:		boolean 
	Border_Bottom?:		boolean 
	renderTd?:			(t: TFunction) => ReactNode
}
