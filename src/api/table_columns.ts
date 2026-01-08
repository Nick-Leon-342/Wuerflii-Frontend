

import type { Axios } from 'axios'
import type { Type__Table_Columns } from '../types/Type__Table_Column'
import type { Type__Server_Response__Table_Columns__Get } from '../types/Type__Server_Response/Type__Server_Response__Table_Columns__GET'
import type { Type__Client_To_Server__Table_Columns__PATCH } from '../types/Type__Client_To_Server/Type__Client_To_Server__Table_Columns__PATCH'





export async function get__table_columns(
	axiosPrivate:	Axios, 
	session_id:		number, 
): Promise<Array<Type__Server_Response__Table_Columns__Get>> {
	return axiosPrivate.get(`/game/table_columns?session_id=${session_id}`).then(({ data }) => data)
}

export async function patch__table_columns(
	axiosPrivate:	Axios, 
	json:			Type__Client_To_Server__Table_Columns__PATCH, 
): Promise<Type__Table_Columns> {
	return axiosPrivate.patch('/game/table_columns', json).then(({ data }) => data)
}





export async function get__table_columns_archive(
	axiosPrivate:	Axios, 
	session_id: 	number, 
	finalscore_id:	number, 
): Promise<JSON> {
	return axiosPrivate.get(`/game/table_columns/archive?session_id=${session_id}&finalscore_id=${finalscore_id}`).then(({ data }) => data)
}
