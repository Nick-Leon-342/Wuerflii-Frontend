

import type { Type__Table_Columns } from '../Type__Table_Column'
import type { Type__Server_Reponse__Player__Get } from './Type__Server_Response__Player__GET'

export interface Type__Server_Response__Table_Columns__Get {
	PlayerID:				Type__Server_Reponse__Player__Get['id']
	List__Table_Columns:	Array<Type__Table_Columns>
}
