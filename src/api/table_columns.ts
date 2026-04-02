

import type { Axios } from 'axios'

import type { Type__Client_To_Server__Table_Columns__PATCH } from '../types/Type__Client_To_Server/Type__Client_To_Server__Table_Columns__PATCH'
import type { Type__Player_With_Table_Columns } from '../types/Type__Player_With_Table_Columns'
import type { Type__Table_Columns } from '../types/Type__Table_Column'





export async function get__table_columns(
	api:		Axios, 
	session_id:	number, 
): Promise<Array<Type__Player_With_Table_Columns>> {
	return api.get(`/game/table_columns?session_id=${session_id}`).then(({ data }) => data)
}

export async function patch__table_columns(
	api:	Axios, 
	json:	Type__Client_To_Server__Table_Columns__PATCH, 
): Promise<Type__Table_Columns> {
	return api.patch('/game/table_columns', json).then(({ data }) => data)
}





export async function get__table_columns_archive(
	api:			Axios, 
	session_id: 	number, 
	finalscore_id:	number, 
): Promise<Array<Type__Player_With_Table_Columns>> {
	return api.get(`/game/table_columns/archive?session_id=${session_id}&finalscore_id=${finalscore_id}`).then(({ data }) => data)
}
