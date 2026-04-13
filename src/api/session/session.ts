

import { api } from '../axios'

import type { Type__Client_To_Server__Session_Date__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session_Date__PATCH'
import type { Type__Session, Type__Session_PATCH, Type__Session_POST } from '../../types/Zod__Session'






// __________________________________________________ Session __________________________________________________

export async function get__session(
	session_id: number, 
): Promise<Type__Session> {
	return api.get(
		'/session', 
		{ params: { session_id } }
	).then(({ data }) => data)
}

export async function post__session(
	json: 	Type__Session_POST, 
): Promise<Type__Session> {
	return api.post(
		'/session', 
		json
	).then(({ data }) => data)
}

export async function patch__session(
	session_id: number, 
	json: 	Type__Session_PATCH, 
): Promise<undefined> {
	return api.patch(
		'/session', 
		json, 
		{ params: { session_id } }
	).then(({ data }) => data)
}

export async function delete__session(
	session_id: number, 
): Promise<undefined> {
	return api.delete(
		'/session', 
		{ params: { session_id } }, 
	).then(({ data }) => data)
}





// __________________________________________________ Session Custom Date __________________________________________________

export async function patch__session_date(
	json:	Type__Client_To_Server__Session_Date__PATCH, 
): Promise<undefined> {
	return api.patch('/session/date', json).then(({ data }) => data)
}





// __________________________________________________ List of sessions __________________________________________________

export async function get__sessions_list(): Promise<Array<Type__Session>> {
	return api.get('/session/all').then(({ data }) => data)
}
