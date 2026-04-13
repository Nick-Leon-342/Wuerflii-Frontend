

import { api } from '../axios'

import type { Type__Server_Response__Player_Env__Get } from '../../types/Type__Server_Response/Type__Server_Response__Player_Env__Get'
import type { Type__Client_To_Server__Player__POST } from '@/types/Type__Client_To_Server/Type__Client_To_Server__Player__POST'
import type { Type__Player } from '../../types/Type__Player'





export async function get__session_players(
	session_id:	number,
): Promise<Array<Type__Player>> {
	return api.get(
		'/session/players', 
		{ params: { session_id } }
	).then(({ data }) => data)
}

export async function post__session_players(
	session_id:		number, 
	List__Players:	Array<Type__Client_To_Server__Player__POST>, 
): Promise<Array<Type__Player>> {
	return api.post(
		'/session/players', 
		{ List__Players }, 
		{ params: { session_id } }, 
	).then(({ data }) => data)
}

export async function patch__session_players(
	session_id:		number, 
	List__Players:	Array<Type__Client_To_Server__Player__POST>, 
): Promise<null> {
	return api.patch(
		'/session/players', 
		{ List__Players }, 
		{ params: { session_id } }, 
	).then(({ data }) => data)
}





export async function get__session_players_env(): Promise<Type__Server_Response__Player_Env__Get> {
	return api.get(`/session/players/env`).then(({ data }) => data)
}
