

import type { Axios } from 'axios'

import type { Type__Server_Response__Analytics_Session__GET } from '../types/Type__Server_Response/Type__Server_Response__Analytics_Session__GET'
import type { Type__Server_Response__Analytics__GET } from '../types/Type__Server_Response/Type__Server_Response__Analytics__GET'





export function get__analytics(
	api: Axios, 
): Promise<Type__Server_Response__Analytics__GET> {
	return api.get('/analytics').then(({ data }) => data)
}

export function get__analytics_session(
	api:		Axios, 
	session_id:	number, 
): Promise<Type__Server_Response__Analytics_Session__GET> {
	return api.get(`/analytics/session?session_id=${session_id}`).then(({ data }) => data)
}
