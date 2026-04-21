

import { api } from './axios'

import type { Type__Table_Columns, Type__Table_Columns__PATCH } from '@/types/Zod__Table_Columns'
import type { Type__Player_With_Table_Columns } from '@/types/Zod__Player'





export async function get__table_columns(
	session_id:	number, 
): Promise<Array<Type__Player_With_Table_Columns>> {
	return api.get(`/game/table_columns?session_id=${session_id}`).then(({ data }) => data)
}

export async function patch__table_columns(
	session_id:	number, 
	json:	Type__Table_Columns__PATCH, 
): Promise<Type__Table_Columns> {
	return api.patch(
		'/game/table_columns', 
		json, 
		{ params: { session_id } }
	).then(({ data }) => data)
}





export async function get__table_columns_archive(
	session_id: 	number, 
	finalscore_id:	number, 
): Promise<Array<Type__Player_With_Table_Columns>> {
	return api.get(`/game/table_columns/archive?session_id=${session_id}&finalscore_id=${finalscore_id}`).then(({ data }) => data)
}
