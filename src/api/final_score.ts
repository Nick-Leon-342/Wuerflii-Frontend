

import type { Axios } from 'axios'
import type { Type__Server_Response__Final_Score__GET } from '../types/Type__Server_Response/Type__Server_Response__Final_Score__GET'
import type { Type__Server_Response__Final_Score__All__GET } from '../types/Type__Server_Response/Type__Server_Response__Final_Score__All__GET'





export async function get__final_score(
	axiosPrivate: 	Axios, 
	session_id:		number, 
	final_score_id:	number, 
): Promise<Type__Server_Response__Final_Score__GET> {
	return axiosPrivate.get(`/finalscore?session_id=${session_id}&finalscore_id=${final_score_id}`).then(({ data }) => data)
}

export async function get__final_scores_page(
	axiosPrivate:	Axios, 
	session_id:		number, 
	page:			number, 
): Promise<Type__Server_Response__Final_Score__All__GET> {
	return axiosPrivate.get(
		`/finalscore/all?session_id=${session_id}&offset_block=${page}`
	).then(({ data }) => {
		return {
			nextPage: data.Has_More ? page + 1 : undefined, 
			currentPage: page,
			list_finalscores: data.List,
		}
	})
}
