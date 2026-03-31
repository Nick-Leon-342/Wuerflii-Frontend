

import type { Axios } from 'axios'

import type { Type__Final_Score } from '@/types/Type__Final_Score'






export async function get__final_score(
	api: 			Axios, 
	session_id:		number, 
	final_score_id:	number, 
): Promise<Type__Final_Score> {
	return api.get(`/finalscore?session_id=${session_id}&finalscore_id=${final_score_id}`).then(({ data }) => data)
}





interface Type__Server_Response__Final_Score__All__GET {
	nextPage:			number | undefined
	currentPage:		number
	list_finalscores:	Array<Type__Final_Score>
}

export async function get__final_scores_page(
	api:		Axios, 
	session_id:	number, 
	page:		number, 
): Promise<Type__Server_Response__Final_Score__All__GET> {
	return api.get(
		`/finalscore/all?session_id=${session_id}&offset_block=${page}`
	).then(({ data }) => {
		return {
			nextPage: data.Has_More ? page + 1 : undefined, 
			currentPage: page,
			list_finalscores: data.List,
		}
	})
}
