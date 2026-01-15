

import type { Axios } from 'axios'
import type { Type__Server_Response__Analytics__GET } from '../types/Type__Server_Response/Type__Server_Response__Analytics__GET'
import type { Type__Server_Response__Analytics_Session__GET } from '../types/Type__Server_Response/Type__Server_Response__Analytics_Session__GET'

export function get__analytics(
	axiosPrivate:	Axios, 
): Promise<Type__Server_Response__Analytics__GET> {
	return axiosPrivate.get('/analytics').then(({ data }) => data)
}

export function get__analytics_session(
	axiosPrivate:	Axios, 
	session_id:		number, 
): Promise<Type__Server_Response__Analytics_Session__GET> {
	return axiosPrivate.get(`/analytics/session?session_id=${session_id}`).then(({ data }) => data)
}
