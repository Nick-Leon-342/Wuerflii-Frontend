

import type { Axios } from 'axios'

import type { Type__Client_To_Server__Session_Date__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session_Date__PATCH'
import type { Type__Client_To_Server__Session_ENV__GET } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session_ENV__GET'
import type { Type__Client_To_Server__Session__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session__PATCH'
import type { Type__Client_To_Server__Session__POST } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session__POST'
import type { Type__Session } from '../../types/Type__Session'






// __________________________________________________ Session __________________________________________________

export async function get__session(
	api: 		Axios, 
	session_id: number, 
): Promise<Type__Session> {
	return api.get(`/session?session_id=${session_id}`).then(({ data }) => data)
}

export async function post__session(
	api: 	Axios, 
	json: 	Type__Client_To_Server__Session__POST, 
): Promise<Type__Session> {
	return api.post('/session', json).then(({ data }) => data)
}

export async function patch__session(
	api: 	Axios, 
	json: 	Type__Client_To_Server__Session__PATCH, 
): Promise<undefined> {
	return api.patch('/session', json).then(({ data }) => data)
}

export async function delete__session(
	api: 		Axios, 
	session_id: number, 
): Promise<undefined> {
	return api.delete(`/session?session_id=${session_id}`).then(({ data }) => data)
}





// __________________________________________________ Session Custom Date __________________________________________________

export async function patch__session_date(
	api: 	Axios, 
	json:	Type__Client_To_Server__Session_Date__PATCH, 
): Promise<undefined> {
	return api.patch('/session/date', json).then(({ data }) => data)
}





// __________________________________________________ Session Env_Variables __________________________________________________

export async function get__session_env_variables(
	api: Axios, 
): Promise<Type__Client_To_Server__Session_ENV__GET> {
	return api.get('/session/env').then(({ data }) => data)
}





// __________________________________________________ List of sessions __________________________________________________

export async function get__sessions_list(
	api: Axios, 
): Promise<Array<Type__Session>> {
	return api.get('/session/all').then(({ data }) => data)
}
