

import type { Axios } from 'axios'

import type { Type__Client_To_Server__Session_Players__POST_And_PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session_Players__POST_And_PATCH'
import type { Type__Server_Response__Player_Env__Get } from '../../types/Type__Server_Response/Type__Server_Response__Player_Env__Get'
import type { Type__Player } from '../../types/Type__Player'





export async function get__session_players(
	api:		Axios, 
	session_id:	number,
): Promise<Array<Type__Player>> {
	return api.get(`/session/players?session_id=${session_id}`).then(({ data }) => data)
}

export async function post__session_players(
	api:	Axios, 
	json:	Type__Client_To_Server__Session_Players__POST_And_PATCH, 
): Promise<Array<Type__Player>> {
	return api.post('/session/players', json).then(({ data }) => data)
}

export async function patch__session_players(
	api:	Axios, 
	json:	Type__Client_To_Server__Session_Players__POST_And_PATCH, 
): Promise<null> {
	return api.patch('/session/players', json).then(({ data }) => data)
}





export async function get__session_players_env(
	api: Axios, 
): Promise<Type__Server_Response__Player_Env__Get> {
	return api.get(`/session/players/env`).then(({ data }) => data)
}
