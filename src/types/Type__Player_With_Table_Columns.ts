

import type { Type__Table_Columns } from './Type__Table_Column'
import type { Type__Player } from './Type__Player'

export interface Type__Player_With_Table_Columns extends Type__Player {
	List__Table_Columns:	Array<Type__Table_Columns>
}
