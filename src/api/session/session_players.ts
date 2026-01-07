

import type { Axios } from 'axios'
import type { Type__Server_Reponse__Player__Get } from '../../types/Type__Server_Response/Type__Server_Response__Player__GET'
import type { Type__Client_To_Server__Session_Players__POST_And_PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session_Players__POST_And_PATCH'





export function get__session_players(
	axiosPrivate:	Axios, 
	session_id:		number,
): Promise<Array<Type__Server_Reponse__Player__Get>> {
	return axiosPrivate.get(`/session/players?session_id=${session_id}`).then(({ data }) => data)
}

export function post__session_players(
	axiosPrivate:	Axios, 
	json:			Type__Client_To_Server__Session_Players__POST_And_PATCH, 
): Promise<Array<Type__Server_Reponse__Player__Get>> {
	return axiosPrivate.post('/session/players', json).then(({ data }) => data)
}

export function patch__session_players(
	axiosPrivate:	Axios, 
	json:			Type__Client_To_Server__Session_Players__POST_And_PATCH, 
): Promise<null> {
	return axiosPrivate.patch('/session/players', json).then(({ data }) => data)
}
