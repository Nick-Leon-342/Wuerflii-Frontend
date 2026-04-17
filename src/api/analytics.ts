

import { api } from './axios'

import type { Type__Analytics_Session } from '../types/Type__Analytics_Session'
import type { Type__Analytics } from '../types/Type__Analytics'





export async function get__analytics(): Promise<Type__Analytics> {
	return api.get('/analytics').then(({ data }) => data)
}

export async function get__analytics_session(
	session_id:	number, 
): Promise<Type__Analytics_Session> {
	return api.get(
		'/analytics/session', 
		{ params: { session_id } }
	).then(({ data }) => data)
}
